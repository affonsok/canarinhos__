#!/bin/sh
set -e

echo "==> Verificando banco de dados SQLite..."
npx prisma db push --skip-generate

if [ "$AUTO_SEED" = "true" ]; then
  echo "==> Executando seed de repertório e materiais..."
  npx tsx prisma/seed.ts || true
  echo "==> Executando seed de usuários e eventos..."
  npx tsx scripts/seed_demo.ts || true
fi

echo "==> Iniciando Canarinhos..."
exec "$@"
