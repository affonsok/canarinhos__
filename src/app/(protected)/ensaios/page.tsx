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
  Tabs,
} from "@mantine/core";
import {
  IconFlame,
  IconCalendarWeek,
  IconHeadphones,
  IconBell,
  IconClock,
  IconSparkles,
  IconMusic,
  IconCalendarEvent,
  IconTrophy,
} from "@tabler/icons-react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { MaterialsExplorer } from "@/components/MaterialsExplorer";
import { ChoirRanking, type RankingUser } from "@/components/ChoirRanking";
import { EventsManager, type EventItem } from "@/components/EventsManager";
import type { Announcement, Material, PracticeStats } from "@/components/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EnsaiosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // 1. Carrega materiais do banco
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

  // 2. Carrega avisos
  const dbAnnouncements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const announcements: Announcement[] = dbAnnouncements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    eventDate: a.eventDate ? a.eventDate.toISOString() : null,
    location: a.location,
    createdAt: a.createdAt.toISOString(),
  }));

  // 3. Carrega estatísticas do usuário atual
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  let stats: PracticeStats = {
    totalSessions: 0,
    weekSessions: 0,
    lastPracticeAt: null,
  };

  if (currentUser) {
    const totalSessions = await prisma.practiceLog.count({
      where: { userId: currentUser.id },
    });
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSessions = await prisma.practiceLog.count({
      where: {
        userId: currentUser.id,
        timestamp: { gte: weekAgo },
      },
    });
    const lastLog = await prisma.practiceLog.findFirst({
      where: { userId: currentUser.id },
      orderBy: { timestamp: "desc" },
    });
    stats = {
      totalSessions,
      weekSessions,
      lastPracticeAt: lastLog?.timestamp?.toISOString() || null,
    };
  }

  // 4. Carrega ranking dos cantores
  const allUsers = await prisma.user.findMany({
    include: {
      practiceLogs: true,
    },
  });

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const ranking: RankingUser[] = allUsers
    .map((u) => {
      const totalSessions = u.practiceLogs.length;
      const weekSessions = u.practiceLogs.filter(
        (log) => new Date(log.timestamp) >= oneWeekAgo
      ).length;
      const totalMinutes = Math.round(
        u.practiceLogs.reduce((acc, log) => acc + (log.duration || 120), 0) / 60
      );
      const lastLog = u.practiceLogs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

      return {
        id: u.id,
        name: u.name,
        voicePart: u.voicePart || "Tutti",
        totalSessions,
        weekSessions,
        totalMinutes,
        lastPracticeAt: lastLog ? lastLog.timestamp.toISOString() : null,
        rank: 0,
        medal: "",
      };
    })
    .sort((a, b) => {
      if (b.weekSessions !== a.weekSessions) {
        return b.weekSessions - a.weekSessions;
      }
      return b.totalSessions - a.totalSessions;
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      medal:
        index === 0
          ? "🥇 Ouro"
          : index === 1
            ? "🥈 Prata"
            : index === 2
              ? "🥉 Bronze"
              : "⭐ Participante",
    }));

  // 5. Carrega eventos com repertório conectado
  const dbEvents = await prisma.event.findMany({
    include: {
      materials: {
        select: {
          id: true,
          title: true,
          type: true,
          voicePart: true,
        },
      },
    },
    orderBy: {
      eventDate: "asc",
    },
  });

  const events: EventItem[] = dbEvents.map((evt) => ({
    id: evt.id,
    title: evt.title,
    description: evt.description,
    eventDate: evt.eventDate.toISOString(),
    location: evt.location,
    materials: evt.materials,
  }));

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
                Canarinhos de Campo Largo • Portal do Aluno
              </Badge>
              <Title order={1} fw={900} c="canarinhosBlue.7">
                Área de Ensaios & Repertório
              </Title>
              <Text size="md" c="dimmed" mt={4}>
                Olá, <strong>{session.user.name || session.user.email}</strong>.
                Acesse suas partituras, áudios de naipe e compromissos do coro.
              </Text>
            </div>
          </Group>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Group justify="space-between" align="flex-start">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Seus Ensaios Nesta Semana
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
                {stats.weekSessions > 0 ? "sessão(ões) ativa(s)" : "nenhuma sessão ainda"}
              </Text>
            </Group>
          </Paper>

          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Group justify="space-between" align="flex-start">
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">
                Total Acumulado
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
                Próximo Compromisso
              </Text>
              <ThemeIcon color="yellow.7" variant="light" size="md" radius="md">
                <IconCalendarEvent size={18} />
              </ThemeIcon>
            </Group>
            <Group align="flex-end" gap="xs" mt={10}>
              <Text fw={700} size="0.95rem" lh={1.3} c="canarinhosBlue.7" lineClamp={1}>
                {events[0] ? events[0].title : "Nenhum no momento"}
              </Text>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Abas Principais (Repertório / Compromissos / Ranking) */}
        <Tabs defaultValue="repertorio" color="canarinhosBlue" radius="md">
          <Tabs.List mb="xl">
            <Tabs.Tab
              value="repertorio"
              leftSection={<IconMusic size={16} />}
              style={{ fontWeight: 600, fontSize: "15px" }}
            >
              Repertório & Músicas ({materials.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="eventos"
              leftSection={<IconCalendarEvent size={16} />}
              style={{ fontWeight: 600, fontSize: "15px" }}
            >
              Compromissos & Repertório do Evento ({events.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="ranking"
              leftSection={<IconTrophy size={16} />}
              style={{ fontWeight: 600, fontSize: "15px" }}
            >
              Ranking de Dedicação ({ranking.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Aba 1: Repertório & Músicas */}
          <Tabs.Panel value="repertorio">
            <Stack gap="xl">
              {/* Avisos */}
              {announcements.length > 0 && (
                <Box>
                  <Group justify="space-between" mb="xs">
                    <Text fw={700} size="sm" c="dimmed" tt="uppercase">
                      Avisos Importantes da Regência
                    </Text>
                  </Group>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    {announcements.map((a) => (
                      <AnnouncementCard key={a.id} announcement={a} />
                    ))}
                  </SimpleGrid>
                </Box>
              )}

              <MaterialsExplorer initialMaterials={materials} />
            </Stack>
          </Tabs.Panel>

          {/* Aba 2: Compromissos & Repertório Vinculado */}
          <Tabs.Panel value="eventos">
            <EventsManager initialEvents={events} allMaterials={materials} />
          </Tabs.Panel>

          {/* Aba 3: Ranking de Dedicação Vocal */}
          <Tabs.Panel value="ranking">
            <ChoirRanking ranking={ranking} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
}
