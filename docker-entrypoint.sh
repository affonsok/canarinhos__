#!/bin/sh
set -e

echo "==> Verificando banco de dados SQLite..."
npx prisma db push --skip-generate

if [ "$AUTO_SEED" = "true" ]; then
  echo "==> Executando seed de obras e usuários..."
  npx tsx scripts/seed_demo.ts || true
fi

echo "==> Iniciando Canarinhos..."
exec "$@"
