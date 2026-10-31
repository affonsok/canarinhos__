"use client";

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
  IconHeadphones,
  IconBell,
  IconSparkles,
  IconMusic,
  IconCalendarEvent,
  IconTrophy,
  IconUsersGroup,
} from "@tabler/icons-react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { MaterialsExplorer } from "@/components/MaterialsExplorer";
import { ChoirRanking, type RankingUser } from "@/components/ChoirRanking";
import { EventsManager, type EventItem } from "@/components/EventsManager";
import { StudentsManager, type StudentItem } from "@/components/StudentsManager";
import type { Announcement, Material, PracticeStats } from "@/components/types";

interface EnsaiosDashboardProps {
  user: {
    name?: string | null;
    email?: string | null;
    voicePart?: string | null;
  };
  stats: PracticeStats;
  materials: Material[];
  announcements: Announcement[];
  ranking: RankingUser[];
  events: EventItem[];
  students: StudentItem[];
}

export function EnsaiosDashboard({
  user,
  stats,
  materials,
  announcements,
  ranking,
  events,
  students,
}: EnsaiosDashboardProps) {
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
                Olá, <strong>{user.name || user.email}</strong>. Acesse suas partituras,
                áudios de naipe e compromissos do coro.
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

        {/* Abas Principais: Repertório / Compromissos / Ranking / Gestão de Alunos */}
        <Tabs defaultValue="repertorio" color="canarinhosBlue" radius="md">
          <Tabs.List mb="xl">
            <Tabs.Tab
              value="repertorio"
              leftSection={<IconMusic size={16} />}
              style={{ fontWeight: 600, fontSize: "15px" }}
            >
              Repertório (25 Obras)
            </Tabs.Tab>
            <Tabs.Tab
              value="eventos"
              leftSection={<IconCalendarEvent size={16} />}
              style={{ fontWeight: 600, fontSize: "15px" }}
            >
              Compromissos ({events.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="ranking"
              leftSection={<IconTrophy size={16} />}
              style={{ fontWeight: 600, fontSize: "15px" }}
            >
              Ranking de Dedicação ({ranking.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="alunos"
              leftSection={<IconUsersGroup size={16} />}
              style={{ fontWeight: 600, fontSize: "15px" }}
            >
              Gestão de Alunos ({students.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Aba 1: Repertório & Músicas */}
          <Tabs.Panel value="repertorio">
            <Stack gap="xl">
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

              <MaterialsExplorer
                initialMaterials={materials}
                currentUserVoice={user.voicePart}
              />
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

          {/* Aba 4: Gestão de Alunos (CRUD) */}
          <Tabs.Panel value="alunos">
            <StudentsManager initialStudents={students} />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  );
}
