#!/usr/bin/env python3
"""Sincroniza áudios e PDFs do Google Drive para public/materials/ e faz upsert via API interna.

Suporta estrutura de subpastas recursiva:
  Pasta Raiz /
    Grupo Musical /
      Subgrupo (opcional) /
        arquivo.mp3 | arquivo.pdf

Uso:
    python scripts/sync_drive.py            # executa sincronização completa
    python scripts/sync_drive.py --dry-run  # apenas lista arquivos detectados, sem baixar nem chamar API

Variáveis de ambiente obrigatórias (carregadas de .env se python-dotenv estiver instalado):
    GOOGLE_APPLICATION_CREDENTIALS  caminho para JSON da service account
    DRIVE_FOLDER_ID                 ID da pasta raiz do Google Drive
    API_BASE_URL                    URL base da API Next.js (ex.: http://localhost:3000)
    SYNC_SECRET                     token compartilhado com o endpoint /api/materials/sync
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import re
import sys
import time
import unicodedata
from pathlib import Path
from typing import Any

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

REQUIRED_PACKAGES = {
    "googleapiclient": "google-api-python-client",
    "google.oauth2": "google-auth-oauthlib",
    "requests": "requests",
}


def _check_dependencies() -> None:
    missing: list[str] = []
    for module, package in REQUIRED_PACKAGES.items():
        try:
            __import__(module)
        except ImportError:
            missing.append(package)
    if missing:
        raise SystemExit(
            f"Dependências ausentes: {', '.join(missing)}. "
            f"Instale com: pip install -r requirements.txt"
        )


_check_dependencies()

from google.oauth2 import service_account  # noqa: E402
from googleapiclient.discovery import build  # noqa: E402
from googleapiclient.errors import HttpError  # noqa: E402
from googleapiclient.http import MediaIoBaseDownload  # noqa: E402
import requests  # noqa: E402

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
DOWNLOAD_DIR = Path("public/materials")
MAX_RETRIES = 3
RETRY_BACKOFF = 2

VOICE_KEYWORDS: dict[str, str] = {
    "SOPRANO": "soprano",
    "CONTRALTO": "contralto",
    "TENOR": "tenor",
    "BAIXO": "baixo",
    "BARÍTONOS": "baritono",
    "BARITONO": "baritono",
    "GRAVES": "baixo",
    "GUIA": "guia",
    "SOLO": "solo",
}


def configure_logging() -> logging.Logger:
    logger = logging.getLogger("sync_drive")
    if logger.handlers:
        return logger
    handler = logging.StreamHandler(sys.stdout)

    class JsonFormatter(logging.Formatter):
        def format(self, record: logging.LogRecord) -> str:
            payload: dict[str, Any] = {
                "timestamp": self.formatTime(record),
                "level": record.levelname,
                "message": record.getMessage(),
            }
            if record.exc_info and record.exc_info[0] is not None:
                payload["exception"] = self.formatException(record.exc_info)
            return json.dumps(payload, ensure_ascii=False)

    handler.setFormatter(JsonFormatter())
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger


LOGGER = configure_logging()


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    lowered = ascii_text.lower()
    cleaned = re.sub(r"[^a-z0-9]+", "-", lowered).strip("-")
    return cleaned or "arquivo"


def clean_folder_name(name: str) -> str:
    """Remove prefixos numéricos de ordenação (ex: '1. ') mas preserva números no nome."""
    cleaned = re.sub(r"^\d+\.\s*", "", name)
    cleaned = re.sub(r"[-_]", " ", cleaned)
    cleaned = re.sub(r"\(\s*\)", "", cleaned)
    return cleaned.strip()


def get_env_or_exit(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise SystemExit(f"Variável de ambiente obrigatória não definida: {name}")
    return value


def build_drive_service():
    credentials_path = get_env_or_exit("GOOGLE_APPLICATION_CREDENTIALS")
    if not Path(credentials_path).exists():
        raise SystemExit(f"Arquivo de credenciais não encontrado: {credentials_path}")
    credentials = service_account.Credentials.from_service_account_file(
        credentials_path, scopes=SCOPES
    )
    return build("drive", "v3", credentials=credentials, cache_discovery=False)


def list_folders(service, parent_id: str) -> list[dict[str, Any]]:
    """Lista subpastas diretas de um folder."""
    query = (
        f"'{parent_id}' in parents "
        f"and mimeType = 'application/vnd.google-apps.folder' "
        f"and trashed = false"
    )
    folders: list[dict[str, Any]] = []
    page_token: str | None = None
    while True:
        response = (
            service.files()
            .list(
                q=query,
                fields="nextPageToken, files(id, name)",
                pageSize=100,
                pageToken=page_token,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            .execute()
        )
        folders.extend(response.get("files", []))
        page_token = response.get("nextPageToken")
        if not page_token:
            break
    return folders


def list_files_in_folder(service, folder_id: str) -> list[dict[str, Any]]:
    """Lista arquivos de áudio/PDF diretamente em um folder (não recursivo)."""
    query = (
        f"'{folder_id}' in parents "
        f"and trashed = false "
        f"and ("
        f"  mimeType contains 'audio/' "
        f"  or mimeType = 'application/pdf'"
        f")"
    )
    files: list[dict[str, Any]] = []
    page_token: str | None = None
    while True:
        response = (
            service.files()
            .list(
                q=query,
                fields="nextPageToken, files(id, name, mimeType, modifiedTime)",
                pageSize=100,
                pageToken=page_token,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            .execute()
        )
        files.extend(response.get("files", []))
        page_token = response.get("nextPageToken")
        if not page_token:
            break
    return files


def walk_drive_folder(
    service, root_id: str
) -> list[dict[str, Any]]:
    """Percorre recursivamente a árvore de pastas do Drive.

    Retorna lista de dicts com: id, name, mimeType, modifiedTime, groupSlug, voicePart.
    A heurística de grupo: primeira pasta abaixo da raiz define o grupo.
    Se houver subpasta numerada dentro do grupo, ela vira parte do slug do grupo.
    Arquivos na raiz do grupo herdam o slug do grupo.
    """
    results: list[dict[str, Any]] = []

    def _walk(folder_id: str, group_slug: str | None, depth: int) -> None:
        # Lista arquivos neste nível
        files = list_files_in_folder(service, folder_id)
        for f in files:
            voice_part = detect_voice_part(f["name"])
            results.append({
                **f,
                "groupSlug": group_slug or "sem-grupo",
                "voicePart": voice_part,
            })

        # Lista subpastas e desce recursivamente
        subfolders = list_folders(service, folder_id)
        for sf in subfolders:
            sf_name = sf["name"]
            if depth == 0:
                # Primeiro nível: define o grupo
                new_group = slugify(clean_folder_name(sf_name))
                _walk(sf["id"], new_group, depth + 1)
            elif depth == 1 and re.match(r"\d+\.", sf_name):
                # Segundo nível com numeração: estende o slug do grupo
                extended = slugify(clean_folder_name(sf_name))
                combined = f"{group_slug}-{extended}" if group_slug else extended
                _walk(sf["id"], combined, depth + 1)
            else:
                # Níveis mais profundos: mantém o mesmo grupo
                _walk(sf["id"], group_slug, depth + 1)

    _walk(root_id, None, 0)
    LOGGER.info(f"Arquivos encontrados no Drive (recursivo): {len(results)}")
    return results


def detect_voice_part(file_name: str) -> str | None:
    upper = file_name.upper()
    for keyword, part in VOICE_KEYWORDS.items():
        if keyword in upper:
            return part
    return None


def download_file(service, file_id: str, dest_path: Path, dry_run: bool) -> bool:
    if dry_run:
        LOGGER.info(f"[DRY-RUN] Download seria feito para: {dest_path}")
        return True
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    request = service.files().get_media(fileId=file_id, supportsAllDrives=True)
    with open(dest_path, "wb") as fh:
        downloader = MediaIoBaseDownload(fh, request, chunksize=5 * 1024 * 1024)
        done = False
        while not done:
            _, done = downloader.next_chunk()
    LOGGER.info(f"Download concluído: {dest_path}")
    return True


def notify_api(payload: dict[str, Any], api_base_url: str, secret: str, dry_run: bool) -> bool:
    url = f"{api_base_url.rstrip('/')}/api/materials/sync"
    if dry_run:
        LOGGER.info(f"[DRY-RUN] POST {url} com payload: {json.dumps(payload, ensure_ascii=False)}")
        return True
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {secret}",
    }
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 429:
                wait = int(response.headers.get("Retry-After", RETRY_BACKOFF ** attempt))
                LOGGER.warning(f"Quota excedida (429). Aguardando {wait}s antes de tentar novamente.")
                time.sleep(wait)
                continue
            if response.status_code >= 500:
                LOGGER.warning(
                    f"Erro do servidor ({response.status_code}). Tentativa {attempt}/{MAX_RETRIES}."
                )
                time.sleep(RETRY_BACKOFF ** attempt)
                continue
            response.raise_for_status()
            LOGGER.info(f"Upsert na API OK para driveId={payload.get('driveId')}")
            return True
        except requests.exceptions.ConnectionError as exc:
            LOGGER.warning(f"Erro de rede na tentativa {attempt}/{MAX_RETRIES}: {exc}")
            time.sleep(RETRY_BACKOFF ** attempt)
        except requests.exceptions.Timeout as exc:
            LOGGER.warning(f"Timeout na tentativa {attempt}/{MAX_RETRIES}: {exc}")
            time.sleep(RETRY_BACKOFF ** attempt)
    LOGGER.error(f"Falha definitiva ao notificar API para driveId={payload.get('driveId')}")
    return False


def build_local_path(group_slug: str, file_type: str, original_name: str) -> Path:
    """Constrói caminho local seguindo a estrutura de organize_materials.py."""
    ext = Path(original_name).suffix.lower()
    stem = Path(original_name).stem
    # Limpa nome preservando informação de naipe
    normalized = unicodedata.normalize("NFKD", stem)
    ascii_stem = normalized.encode("ascii", "ignore").decode("ascii")
    cleaned = re.sub(r"[^a-zA-Z0-9\s\-]", "", ascii_stem).strip()
    cleaned = re.sub(r"\s+", "-", cleaned)
    safe_name = f"{cleaned}{ext}" if cleaned else f"arquivo{ext}"
    return DOWNLOAD_DIR / file_type / group_slug / safe_name


def sync(dry_run: bool) -> None:
    folder_id = get_env_or_exit("DRIVE_FOLDER_ID")
    api_base_url = get_env_or_exit("API_BASE_URL")
    sync_secret = get_env_or_exit("SYNC_SECRET")

    service = build_drive_service()
    files = walk_drive_folder(service, folder_id)

    successes = 0
    failures = 0
    for file_meta in files:
        drive_id = file_meta["id"]
        name = file_meta["name"]
        mime_type = file_meta["mimeType"]
        group_slug = file_meta["groupSlug"]
        voice_part = file_meta["voicePart"]

        file_type = "score" if mime_type == "application/pdf" else "audio"
        dest_path = build_local_path(group_slug, file_type, name)

        try:
            download_file(service, drive_id, dest_path, dry_run=dry_run)
            payload: dict[str, Any] = {
                "driveId": drive_id,
                "fileName": dest_path.name,
                "originalName": name,
                "mimeType": mime_type,
                "modifiedTime": file_meta.get("modifiedTime"),
                "localPath": str(dest_path.relative_to(DOWNLOAD_DIR.parent)),
                "groupSlug": group_slug,
                "voicePart": voice_part,
                "type": file_type,
            }
            ok = notify_api(payload, api_base_url, sync_secret, dry_run=dry_run)
            if ok:
                successes += 1
            else:
                failures += 1
        except HttpError as exc:
            status = getattr(exc, "status_code", None) or getattr(exc, "resp", {}).get("status")
            if status in (401, 403):
                LOGGER.error(f"Token expirado ou sem permissão para {drive_id}: {exc}")
            else:
                LOGGER.error(f"Erro na API do Drive para {drive_id}: {exc}")
            failures += 1
        except Exception as exc:
            LOGGER.error(f"Erro inesperado processando {drive_id}: {exc}")
            failures += 1

    LOGGER.info(f"Sincronização finalizada. Sucessos: {successes}, Falhas: {failures}")
    if failures > 0 and not dry_run:
        raise SystemExit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Sincroniza materiais do Google Drive (recursivo)")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Não baixa arquivos nem chama a API; apenas lista e valida configuração.",
    )
    args = parser.parse_args()
    sync(dry_run=args.dry_run)


if __name__ == "__main__":
    main()