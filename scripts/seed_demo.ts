import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedData() {
  const hash = await bcrypt.hash("canarinhos123", 10);

  // Atualiza aluno teste
  await prisma.user.upsert({
    where: { email: "aluno@canarinhos.com" },
    update: { voicePart: "soprano" },
    create: {
      name: "Aluno Teste",
      email: "aluno@canarinhos.com",
      passwordHash: hash,
      role: "member",
      voicePart: "soprano",
    },
  });

  // Cantores infantis do coro
  const singers = [
    { name: "Maria Clara da Silva", email: "maria.clara@canarinhos.com", voicePart: "soprano", sessions: 15 },
    { name: "Lucas Gabriel Moreira", email: "lucas.gabriel@canarinhos.com", voicePart: "tenor", sessions: 12 },
    { name: "Beatriz Lima Souza", email: "beatriz.lima@canarinhos.com", voicePart: "contralto", sessions: 10 },
    { name: "Gabriel Santos Ferreira", email: "gabriel.santos@canarinhos.com", voicePart: "baixo", sessions: 8 },
    { name: "Sofia Helena Ribeiro", email: "sofia.helena@canarinhos.com", voicePart: "soprano", sessions: 6 },
  ];

  const allMaterials = await prisma.material.findMany();
  const sampleMaterialIds = allMaterials.map((m) => m.id);

  for (const s of singers) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, voicePart: s.voicePart },
      create: {
        name: s.name,
        email: s.email,
        passwordHash: hash,
        role: "member",
        voicePart: s.voicePart,
      },
    });

    const logCount = await prisma.practiceLog.count({ where: { userId: user.id } });
    if (logCount === 0 && sampleMaterialIds.length > 0) {
      for (let i = 0; i < s.sessions; i++) {
        const matId = sampleMaterialIds[i % sampleMaterialIds.length];
        const daysAgo = Math.floor(Math.random() * 6);
        const logDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 10000000);
        await prisma.practiceLog.create({
          data: {
            userId: user.id,
            materialId: matId,
            duration: 180 + Math.floor(Math.random() * 300),
            timestamp: logDate,
          },
        });
      }
    }
  }

  // Eventos com repertório
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    const aveVerum = allMaterials.filter(
      (m) => m.title.toLowerCase().includes("ave verum") || m.title.toLowerCase().includes("panis")
    );
    const natal = allMaterials.filter(
      (m) =>
        m.title.toLowerCase().includes("natal") ||
        m.title.toLowerCase().includes("jingle") ||
        m.title.toLowerCase().includes("gloria") ||
        m.title.toLowerCase().includes("christmas")
    );
    const salmo = allMaterials.filter(
      (m) =>
        m.title.toLowerCase().includes("salmo") ||
        m.title.toLowerCase().includes("rutter") ||
        m.title.toLowerCase().includes("lord bless")
    );

    await prisma.event.create({
      data: {
        title: "Missa Solene em Honra a São Domingos Sávio",
        description:
          "Chegada às 09:15 para aquecimento vocal no salão paroquial. Traje: uniforme de gala azul marinho e partituras na pasta oficial.",
        eventDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
        location: "Igreja Matriz Nossa Senhora da Piedade (Campo Largo)",
        materials: {
          connect: aveVerum.slice(0, 5).map((m) => ({ id: m.id })),
        },
      },
    });

    await prisma.event.create({
      data: {
        title: "Grande Concerto de Natal dos Canarinhos",
        description:
          "Apresentação anual especial de Natal com participação da orquestra e solistas convidados. Ensaio geral de palco às 17:30.",
        eventDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000),
        location: "Teatro Municipal de Campo Largo",
        materials: {
          connect: natal.slice(0, 6).map((m) => ({ id: m.id })),
        },
      },
    });

    await prisma.event.create({
      data: {
        title: "Encontro Internacional Pueri Cantores",
        description:
          "Concerto comemorativo em preparação para as viagens e congressos da federação nacional e internacional.",
        eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
        location: "Basílica Santuário",
        materials: {
          connect: salmo.slice(0, 4).map((m) => ({ id: m.id })),
        },
      },
    });

    console.log("🎉 3 eventos com repertório conectado cadastrados!");
  }

  console.log("✅ Cantores e ranking inicial semeados com sucesso!");
}

seedData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
