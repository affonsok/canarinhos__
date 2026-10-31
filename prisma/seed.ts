import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const MATERIALS_DIR = path.join(process.cwd(), 'public', 'materials');

type VoicePart = 'soprano' | 'contralto' | 'tenor' | 'baixo' | 'baritono' | 'todos' | 'solo' | 'guia';

const VOICE_KEYWORDS: Record<string, VoicePart> = {
  SOPRANO: 'soprano',
  CONTRALTO: 'contralto',
  TENOR: 'tenor',
  BAIXO: 'baixo',
  BARITONO: 'baritono',
  BARÍTONOS: 'baritono',
  GRAVES: 'baixo',
  GUIA: 'guia',
  SOLO: 'solo',
};

function detectVoicePart(fileName: string): VoicePart | null {
  const upper = fileName.toUpperCase();
  for (const [keyword, part] of Object.entries(VOICE_KEYWORDS)) {
    if (upper.includes(keyword)) return part;
  }
  return null;
}

function toTitle(folderName: string): string {
  return folderName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  console.log('🌱 Iniciando seed de materiais...');

  // Limpa dados anteriores
  await prisma.practiceLog.deleteMany();
  await prisma.material.deleteMany();
  await prisma.materialGroup.deleteMany();

  const audioDir = path.join(MATERIALS_DIR, 'audio');
  const scoreDir = path.join(MATERIALS_DIR, 'score');

  if (!fs.existsSync(audioDir) && !fs.existsSync(scoreDir)) {
    throw new Error(`Diretórios de materiais não encontrados em ${MATERIALS_DIR}. Rode 'python scripts/organize_materials.py' primeiro.`);
  }

  // Coleta todos os grupos únicos a partir das subpastas
  const groupSlugs = new Set<string>();

  const collectGroups = (baseDir: string) => {
    if (!fs.existsSync(baseDir)) return;
    for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        groupSlugs.add(entry.name);
      }
    }
  };

  collectGroups(audioDir);
  collectGroups(scoreDir);

  // Cria os grupos
  const groupMap = new Map<string, string>(); // slug → id
  for (const slug of Array.from(groupSlugs).sort()) {
    const group = await prisma.materialGroup.create({
      data: {
        name: toTitle(slug),
        slug,
      },
    });
    groupMap.set(slug, group.id);
    console.log(`  📁 Grupo criado: ${group.name} (${slug})`);
  }

  let materialCount = 0;

  // Processa áudios
  if (fs.existsSync(audioDir)) {
    for (const groupSlug of fs.readdirSync(audioDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
      const groupId = groupMap.get(groupSlug);
      const dirPath = path.join(audioDir, groupSlug);
      for (const file of fs.readdirSync(dirPath).filter((f) => !f.startsWith('.'))) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) continue;

        const ext = path.extname(file).toLowerCase();
        const mimeType = ext === '.mp4' ? 'audio/mp4' : ext === '.mp3' ? 'audio/mpeg' : 'application/octet-stream';
        const voicePart = detectVoicePart(file);

        await prisma.material.create({
          data: {
            title: path.basename(file, ext).replace(/-/g, ' '),
            type: 'audio',
            voicePart,
            groupId,
            localPath: `materials/audio/${groupSlug}/${file}`,
            fileName: file,
            mimeType,
          },
        });
        materialCount++;
      }
    }
  }

  // Processa partituras
  if (fs.existsSync(scoreDir)) {
    for (const groupSlug of fs.readdirSync(scoreDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)) {
      const groupId = groupMap.get(groupSlug);
      const dirPath = path.join(scoreDir, groupSlug);
      for (const file of fs.readdirSync(dirPath).filter((f) => !f.startsWith('.'))) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) continue;

        const ext = path.extname(file).toLowerCase();
        const mimeType = ext === '.pdf' ? 'application/pdf' : 'application/octet-stream';

        await prisma.material.create({
          data: {
            title: path.basename(file, ext).replace(/-/g, ' '),
            type: 'score',
            groupId,
            localPath: `materials/score/${groupSlug}/${file}`,
            fileName: file,
            mimeType,
          },
        });
        materialCount++;
      }
    }
  }

  // Cria usuário de teste
  const testEmail = 'aluno@canarinhos.com';
  const existingUser = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!existingUser) {
    const hash = await bcrypt.hash('canarinhos123', 10);
    await prisma.user.create({
      data: {
        name: 'Aluno Teste',
        email: testEmail,
        passwordHash: hash,
        role: 'member',
      },
    });
    console.log(`👤 Usuário de teste criado: ${testEmail} / canarinhos123`);
  } else {
    console.log(`👤 Usuário de teste já existe: ${testEmail}`);
  }

  // Cria avisos de teste se não houver nenhum
  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Ensaio Geral - Preparação para o Concerto',
          content: 'Lembramos a todos os cantores que nosso ensaio geral acontecerá no próximo sábado. Tragam suas partituras e garrafas de água.',
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          location: 'Salão Principal do Coro',
        },
        {
          title: 'Novos Áudios de Naipe Disponíveis',
          content: 'Foram adicionados os áudios guias de Soprano, Contralto, Tenor e Baixo para o repertório de Natal. Pratiquem com antecedência!',
          location: 'Plataforma Online',
        },
      ],
    });
    console.log('📢 Avisos de teste cadastrados com sucesso.');
  }

  console.log(`✅ Seed concluído: ${groupMap.size} grupos, ${materialCount} materiais.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });