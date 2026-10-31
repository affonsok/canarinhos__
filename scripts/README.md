# Sincronização Google Drive → Materials

Script standalone que autentica com service account do Google Drive, lista áudios e PDFs de uma pasta configurada, baixa para `public/materials/` e faz upsert no banco via endpoint interno `/api/materials/sync`.

## Variáveis de ambiente

Adicione ao `.env` (o `.env.example` do projeto ainda não inclui estas chaves; copie manualmente):

```bash
GOOGLE_APPLICATION_CREDENTIALS=./secrets/service-account.json
DRIVE_FOLDER_ID=1aBcDeFgHiJkLmNoOpQrStUvWxYz
API_BASE_URL=http://localhost:3000
SYNC_SECRET=token-compartilhado-com-endpoint-interno
```

| Variável | Descrição |
|---|---|
| `GOOGLE_APPLICATION_CREDENTIALS` | Caminho para o JSON da service account com acesso de leitura ao Drive |
| `DRIVE_FOLDER_ID` | ID da pasta do Drive onde estão os materiais |
| `API_BASE_URL` | URL base da aplicação Next.js (sem barra final) |
| `SYNC_SECRET` | Token Bearer aceito pelo endpoint `/api/materials/sync` |

## Setup

```bash
pip install -r requirements.txt
```

## Uso

```bash
# Execução normal
python scripts/sync_drive.py

# Apenas validar configuração e listar arquivos (sem baixar nem chamar API)
python scripts/sync_drive.py --dry-run
```

## Comportamento

- Filtra apenas `audio/*` e `application/pdf`.
- Nomeia arquivos locais como `{driveId}_{slug}.{ext}`.
- Upsert por `driveId`: re-executar o script é seguro e idempotente.
- Retries automáticos em erros de rede, timeout e quota (429).
- Logging estruturado em JSON no stdout.
- Em caso de falhas, o processo termina com código 1 (exceto em `--dry-run`).

## Notas

- A service account precisa ter acesso à pasta do Drive (compartilhe a pasta com o e-mail da service account).
- O endpoint `/api/materials/sync` deve estar rodando e aceitar o `SYNC_SECRET` como Bearer token.