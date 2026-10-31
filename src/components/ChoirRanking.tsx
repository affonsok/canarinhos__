"use client";

import {
  Paper,
  Title,
  Text,
  Group,
  Table,
  Badge,
  ThemeIcon,
  SimpleGrid,
  Box,
  Stack,
  RingProgress,
} from "@mantine/core";
import {
  IconTrophy,
  IconFlame,
  IconClock,
  IconUser,
  IconHeadphones,
  IconMedal,
} from "@tabler/icons-react";

export interface RankingUser {
  id: string;
  name: string;
  voicePart: string;
  totalSessions: number;
  weekSessions: number;
  totalMinutes: number;
  lastPracticeAt: string | null;
  rank: number;
  medal: string;
}

const voiceColors: Record<string, string> = {
  soprano: "pink",
  contralto: "grape",
  tenor: "cyan",
  baixo: "indigo",
  baritono: "teal",
  todos: "green",
};

export function ChoirRanking({ ranking }: { ranking: RankingUser[] }) {
  const topThree = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <Stack gap="xl">
      {/* Pódio dos 3 Primeiros */}
      {topThree.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {topThree.map((user, idx) => {
            const isFirst = idx === 0;
            const borderColor =
              idx === 0 ? "#c9a227" : idx === 1 ? "#94a3b8" : "#d97706";
            const bgGradient =
              idx === 0
                ? "linear-gradient(135deg, #fef9e8 0%, #fff 100%)"
                : "white";

            return (
              <Paper
                key={user.id}
                withBorder
                p="lg"
                radius="md"
                shadow={isFirst ? "md" : "xs"}
                style={{
                  background: bgGradient,
                  borderColor,
                  borderWidth: isFirst ? 2 : 1,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Group justify="space-between" align="flex-start" mb="xs">
                  <Badge
                    size="lg"
                    radius="sm"
                    color={idx === 0 ? "yellow.7" : idx === 1 ? "gray.7" : "orange.7"}
                    variant="filled"
                    leftSection={<IconTrophy size={14} />}
                    style={{ color: idx === 0 ? "#1e3a5f" : "#fff" }}
                  >
                    {idx === 0 ? "1º Lugar" : idx === 1 ? "2º Lugar" : "3º Lugar"}
                  </Badge>

                  <Badge
                    size="xs"
                    variant="outline"
                    color={voiceColors[user.voicePart.toLowerCase()] || "gray"}
                    style={{ textTransform: "capitalize" }}
                  >
                    {user.voicePart}
                  </Badge>
                </Group>

                <Text fw={800} size="lg" c="canarinhosBlue.7" mt="xs">
                  {user.name}
                </Text>

                <Group mt="md" justify="space-between" align="flex-end">
                  <div>
                    <Text size="xs" c="dimmed">
                      Ensaios nesta semana
                    </Text>
                    <Group gap={4}>
                      <IconFlame size={16} color="#e03131" />
                      <Text fw={900} size="xl" c="dark.8">
                        {user.weekSessions}x
                      </Text>
                    </Group>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <Text size="xs" c="dimmed">
                      Tempo praticado
                    </Text>
                    <Text fw={700} size="sm" c="canarinhosGold.7">
                      ~{user.totalMinutes} min
                    </Text>
                  </div>
                </Group>
              </Paper>
            );
          })}
        </SimpleGrid>
      )}

      {/* Tabela Completa de Classificação dos Cantores */}
      <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
        <Group justify="space-between" mb="md">
          <Group gap="xs">
            <ThemeIcon color="canarinhosBlue" variant="light" size="md">
              <IconTrophy size={18} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="md" c="dark.8">
                Quadro de Dedicação Vocal
              </Text>
              <Text size="xs" c="dimmed">
                Quanto mais você ouve e repete os áudios do seu naipe, mais pontos você ganha!
              </Text>
            </div>
          </Group>
          <Badge color="yellow.7" variant="light">
            {ranking.length} cantores ativos
          </Badge>
        </Group>

        <Table verticalSpacing="sm" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 60 }}>Pos.</Table.Th>
              <Table.Th>Cantor(a)</Table.Th>
              <Table.Th>Naipe</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Ensaios Semana</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Total Geral</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Tempo Estudo</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {ranking.map((u) => (
              <Table.Tr key={u.id}>
                <Table.Td>
                  <Text fw={700} size="sm" c={u.rank <= 3 ? "yellow.8" : "dimmed"}>
                    {u.rank === 1
                      ? "🥇 1º"
                      : u.rank === 2
                        ? "🥈 2º"
                        : u.rank === 3
                          ? "🥉 3º"
                          : `${u.rank}º`}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <ThemeIcon size={26} radius="xl" color="canarinhosBlue" variant="subtle">
                      <IconUser size={14} />
                    </ThemeIcon>
                    <Text fw={600} size="sm" c="dark.8">
                      {u.name}
                    </Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge
                    size="xs"
                    variant="light"
                    color={voiceColors[u.voicePart.toLowerCase()] || "gray"}
                    style={{ textTransform: "capitalize" }}
                  >
                    {u.voicePart}
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  <Badge color={u.weekSessions > 0 ? "orange" : "gray"} variant="filled" size="sm">
                    {u.weekSessions} ensaios
                  </Badge>
                </Table.Td>
                <Table.Td style={{ textAlign: "center" }}>
                  <Text size="sm" fw={600} c="dark.7">
                    {u.totalSessions}
                  </Text>
                </Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <Text size="xs" fw={700} c="canarinhosBlue.7">
                    {u.totalMinutes} min
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
