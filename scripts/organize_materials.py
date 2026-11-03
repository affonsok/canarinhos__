#!/usr/bin/env python3
"""Organiza arquivos baixados manualmente da pasta ensaio/ para public/materials/.

Estrutura de saída:
  public/materials/audio/<grupo-slug>/<arquivo-limpo>.mp3
  public/materials/score/<grupo-slug>/<arquivo-limpo>.pdf

Regras:
- Áudios: mp3, mp4, m4a, 3gp → tipo audio
- Partituras: pdf → tipo score
- O nome do grupo é extraído do caminho relativo (primeira ou segunda pasta)
- Arquivos com prefixo .PARTITURA são tratados como score mesmo sem extensão .pdf
- Nomes são slugificados mas preservam informação de naipe quando relevante
"""
from __future__ import annotations

import shutil
import unicodedata
import re
import sys
from pathlib import Path

# Configura stdout para UTF-8 no Windows para evitar UnicodeEncodeError com acentos e símbolos
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

SOURCE_DIR = Path("ensaio")
TARGET_DIR = Path("public/materials")

AUDIO_EXTENSIONS = {".mp3", ".mp4", ".m4a", ".3gp", ".wav", ".ogg"}
SCORE_EXTENSIONS = {".pdf"}


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    lowered = ascii_text.lower()
    cleaned = re.sub(r"[^a-z0-9]+", "-", lowered).strip("-")
    return cleaned or "arquivo"


def classify_file(path: Path) -> str | None:
    ext = path.suffix.lower()
    name_lower = path.name.lower()
    if ext in SCORE_EXTENSIONS or name_lower.startswith(".partitura"):
        return "score"
    if ext in AUDIO_EXTENSIONS:
        return "audio"
    return None


def clean_folder_name(name: str) -> str:
    """Remove APENAS prefixos numéricos de ordenação (ex: '1. ', '2.') do início do nome.
    
    Preserva números que fazem parte do nome próprio (ex: 'NATAL 2026', 'Salmo 150').
    A regex ^\\d+\\.\\s* só casa no INÍCIO da string, então '2026' ou '150' no meio/fim não são afetados.
    """
    # Remove prefixo numérico de ordenação: '1. MISSA' → 'MISSA', '11. Ave Maria' → 'Ave Maria'
    # NÃO remove 'NATAL 2026' nem 'Salmo 150' porque o número não está no início seguido de ponto
    cleaned = re.sub(r"^\d+\.\s*", "", name)
    # Substitui separadores comuns por espaço para o slugify unificar
    cleaned = re.sub(r"[-_]", " ", cleaned)
    # Remove parênteses vazios ou com conteúdo irrelevante
    cleaned = re.sub(r"\(\s*\)", "", cleaned)
    return cleaned.strip()

def extract_group_name(rel_path: Path) -> str:
    """Extrai o nome do grupo/música do caminho relativo dentro de ensaio/, limpando numeração."""
    parts = rel_path.parts
    if not parts:
        return "sem-grupo"
    # Primeira parte é sempre o grupo principal (limpa)
    group = clean_folder_name(parts[0])
    # Se houver subpasta numerada (ex: "1. Canto de Entrada"), usa ela como subgrupo limpo
    if len(parts) > 2:
        subgroup = parts[1]
        # Verifica se é uma subpasta de música específica (não apenas naipe)
        if re.match(r"\d+\.\s", subgroup) or re.match(r"\d+\.", subgroup):
            cleaned_sub = clean_folder_name(subgroup)
            return slugify(f"{group} {cleaned_sub}")
    return slugify(group)


def clean_filename(name: str) -> str:
    """Limpa nome de arquivo preservando informação de naipe/tipo."""
    stem = Path(name).stem
    ext = Path(name).suffix.lower()
    # Remove prefixos comuns desnecessários
    cleaned = re.sub(r"^(\.PARTITUTURA|PARTITURA)\s*", "", stem, flags=re.IGNORECASE)
    # Slugify mas preserva maiúsculas de nipes para legibilidade
    normalized = unicodedata.normalize("NFKD", cleaned)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    # Substitui caracteres inválidos mas mantém espaços como hífens
    result = re.sub(r"[^a-zA-Z0-9\s\-]", "", ascii_text).strip()
    result = re.sub(r"\s+", "-", result)
    return f"{result}{ext}" if result else f"arquivo{ext}"


def organize() -> dict[str, int]:
    stats = {"audio": 0, "score": 0, "skipped": 0}

    if not SOURCE_DIR.exists():
        raise SystemExit(f"Pasta fonte não encontrada: {SOURCE_DIR}")

    TARGET_DIR.mkdir(parents=True, exist_ok=True)

    seen_destinations: set[Path] = set()

    for file_path in sorted(SOURCE_DIR.rglob("*")):
        if not file_path.is_file():
            continue

        file_type = classify_file(file_path)
        if file_type is None:
            print(f"[SKIP] Tipo desconhecido: {file_path.relative_to(SOURCE_DIR)}")
            stats["skipped"] += 1
            continue

        rel_path = file_path.relative_to(SOURCE_DIR)
        group_slug = extract_group_name(rel_path)
        clean_name = clean_filename(file_path.name)

        dest_dir = TARGET_DIR / file_type / group_slug
        dest_path = dest_dir / clean_name

        # Se houver colisão de nomes distintos no mesmo lote, adiciona sufixo numérico
        counter = 1
        original_dest = dest_path
        while dest_path in seen_destinations:
            stem = original_dest.stem
            ext = original_dest.suffix
            dest_path = dest_dir / f"{stem}-{counter}{ext}"
            counter += 1
        seen_destinations.add(dest_path)

        dest_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file_path, dest_path)
        print(f"[OK] {file_type}: {rel_path} -> {dest_path.relative_to(TARGET_DIR)}")
        stats[file_type] += 1

    return stats


if __name__ == "__main__":
    results = organize()
    print(f"\nResumo: {results['audio']} áudios, {results['score']} partituras, {results['skipped']} ignorados")