import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Group,
  ThemeIcon,
  Badge,
  Stack,
  Box,
} from "@mantine/core";
import {
  IconFlame,
  IconCalendarWeek,
  IconHeadphones,
  IconBell,
  IconClock,
  IconSparkles,
} from "@tabler/icons-react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { MaterialsExplorer } from "@/components/MaterialsExplorer";
import type { Announcement, Material, PracticeStats } from "@/components/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EnsaiosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Carrega materiais do banco
  const dbMaterials = await prisma.material.findMany({
    orderBy: { uploadedAt: "desc" },
  });
  const materials: Material[] = dbMaterials.map((m) => ({
    id: m.id,
    title: m.title,
    type: m.type as Material["type"],
    voicePart: m.voicePart,
    driveId: m.driveId,
    localPath: m.localPath,
    uploadedAt: m.uploadedAt.toISOString(),
  }));

  // Carrega avisos
  const dbAnnouncements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  const announcements: Announcement[] = dbAnnouncements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    eventDate: a.eventDate ? a.eventDate.toISOString() : null,
    location: a.location,
    createdAt: a.createdAt.toISOString(),
  }));

  // Carrega estatísticas do usuário
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  let stats: PracticeStats = {
    totalSessions: 0,
    weekSessions: 0,
    lastPracticeAt: null,
  };

  if (user) {
    const totalSessions = await prisma.practiceLog.count({
      where: { userId: user.id },
    });
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSessions = await prisma.practiceLog.count({
      where: {
        userId: user.id,
        timestamp: { gte: weekAgo },
      },
    });
    const lastLog = await prisma.practiceLog.findFirst({
      where: { userId: user.id },
      orderBy: { timestamp: "desc" },
    });
    stats = {
      totalSessions,
      weekSessions,
      lastPracticeAt: lastLog?.timestamp?.toISOString() || null,
    };
  }

  return (
    <Box py="xl" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container size="lg">
        {/* Header do Aluno */}
        <Box mb="xl">
          <Group justify="space-between" align="flex-end">
            <div>
              <Badge
                color="yellow.7"
                variant="light"
                size="md"
                leftSection={<IconSparkles size={14} />}
                mb={6}
              >
                Painel do Cantor
              </Badge>
              <Title order={1} fw={800} c="canarinhosBlue.7">
                Área de Ensaios
              </Title>
              <Text size="md" c="dimmed" mt={4}>
                Olá, <strong>{session.user.name || session.user.email}</strong>.
                Bons estudos e afinação para os próximos compromissos!
              </Text>
            </div>
          </Group>
        </Box>

        {/* Stats Grid (Mantine UI StatsGrid pattern) */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Group justify="space-between" align="flex-start">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Ensaios Nesta Semana
              </Text>
              <ThemeIcon color="orange" variant="light" size="md" radius="md">
                <IconFlame size={18} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={10}>
              <Text fw={800} size="1.8rem" lh={1} c="dark.8">
                {stats.weekSessions}
              </Text>
              <Text size="xs" c={stats.weekSessions > 0 ? "teal" : "dimmed"} fw={600}>
                {stats.weekSessions > 0 ? "sessão(ões) ativa(s)" : "nenhum ensaio ainda"}
              </Text>
            </Group>
          </Paper>

          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Group justify="space-between" align="flex-start">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Total de Sessões
              </Text>
              <ThemeIcon color="canarinhosBlue" variant="light" size="md" radius="md">
                <IconHeadphones size={18} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={10}>
              <Text fw={800} size="1.8rem" lh={1} c="dark.8">
                {stats.totalSessions}
              </Text>
              <Text size="xs" c="dimmed">
                gravações estudadas
              </Text>
            </Group>
          </Paper>

          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Group justify="space-between" align="flex-start">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Última Prática
              </Text>
              <ThemeIcon color="yellow.7" variant="light" size="md" radius="md">
                <IconClock size={18} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={10}>
              <Text fw={700} size="1.1rem" lh={1.3} c="dark.8">
                {stats.lastPracticeAt
                  ? new Date(stats.lastPracticeAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Nenhum registro"}
              </Text>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Avisos Recentes */}
        <Box mb="xl">
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <ThemeIcon color="canarinhosBlue" variant="subtle" size="sm">
                <IconBell size={18} />
              </ThemeIcon>
              <Title order={3} fw={700} c="dark.8">
                Avisos & Comunicados
              </Title>
            </Group>
            <Badge color="gray" variant="light">
              {announcements.length} aviso(s)
            </Badge>
          </Group>

          {announcements.length === 0 ? (
            <Paper withBorder p="lg" radius="md" bg="white" ta="center">
              <Text size="sm" c="dimmed">
                Nenhum aviso no momento. Fique atento às orientações da regência!
              </Text>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              {announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Seção Principal de Materiais de Estudo */}
        <Box>
          <Group justify="space-between" mb="md">
            <div>
              <Title order={3} fw={700} c="dark.8">
                Repertório & Materiais de Estudo
              </Title>
              <Text size="sm" c="dimmed">
                Filtre por tipo (áudios ou partituras) e pelo seu naipe de voz
              </Text>
            </div>
            <Badge color="canarinhosBlue" variant="filled" size="lg">
              {materials.length} arquivos disponíveis
            </Badge>
          </Group>

          <MaterialsExplorer initialMaterials={materials} />
        </Box>
      </Container>
    </Box>
  );
}
