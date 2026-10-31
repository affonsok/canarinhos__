"use client";

import Link from "next/link";
import {
  Card,
  Text,
  Badge,
  Group,
  ThemeIcon,
  Button,
  Stack,
  Box,
  SimpleGrid,
  Tooltip,
} from "@mantine/core";
import {
  IconFileText,
  IconHeadphones,
  IconPlayerPlay,
  IconExternalLink,
  IconSparkles,
} from "@tabler/icons-react";
import type { RepertoireWork } from "@/lib/repertoireMetadata";
import {
  formatVoiceButtonLabel,
  VOICE_COLORS,
} from "@/lib/repertoireMetadata";

interface SongCardProps {
  work: RepertoireWork;
  selectedVoice?: string | null;
  currentUserVoice?: string | null;
}

export function SongCard({
  work,
  selectedVoice,
  currentUserVoice,
}: SongCardProps) {
  const activeVoiceFilter =
    selectedVoice && selectedVoice !== "all"
      ? selectedVoice.toLowerCase()
      : null;

  return (
    <Card
      withBorder
      shadow="xs"
      padding="lg"
      radius="md"
      bg="white"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        borderColor: "#e2e8f0",
      }}
      className="hover:shadow-md hover:border-canarinhos-gold"
    >
      <div>
        {/* Cabeçalho do Card */}
        <Group justify="space-between" align="flex-start" mb="xs" wrap="nowrap">
          <Group gap="xs" wrap="wrap">
            <Badge
              size="sm"
              color={work.categoryColor}
              variant="light"
              leftSection={<span>{work.categoryIcon}</span>}
            >
              {work.subCategory || work.categoryLabel}
            </Badge>

            {work.scores.length > 0 && (
              <Badge size="xs" color="orange" variant="outline">
                📄 Partitura inclusa
              </Badge>
            )}

            <Badge size="xs" color="gray" variant="subtle">
              🎧 {work.audios.length} {work.audios.length === 1 ? "áudio" : "áudios"}
            </Badge>
          </Group>
        </Group>

        {/* Título da Obra */}
        <Text fw={800} size="lg" c="canarinhosBlue.7" lh={1.3}>
          {work.name}
        </Text>

        {/* Subtítulo / Compositor / Momento */}
        {work.subtitle && (
          <Text size="xs" c="dimmed" mt={4} mb="md">
            {work.subtitle}
          </Text>
        )}
      </div>

      <Stack gap="sm" mt="sm">
        {/* Bloco de Partitura (se houver) */}
        {work.scores.length > 0 && (
          <Box
            p="xs"
            radius="md"
            style={{
              backgroundColor: "#fffbeb",
              border: "1px solid #fef3c7",
              borderRadius: "8px",
            }}
          >
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <ThemeIcon size={26} radius="md" color="orange" variant="light">
                  <IconFileText size={15} />
                </ThemeIcon>
                <div>
                  <Text size="xs" fw={700} c="dark.8">
                    Partitura Geral (PDF)
                  </Text>
                  <Text size="11px" c="dimmed">
                    {work.scores[0].title}
                  </Text>
                </div>
              </Group>

              <Button
                component={Link}
                href={`/ensaios/material/${work.scores[0].id}`}
                size="xs"
                variant="filled"
                color="orange"
                radius="md"
                rightSection={<IconExternalLink size={13} />}
              >
                Abrir Partitura
              </Button>
            </Group>
          </Box>
        )}

        {/* Bloco de Áudios por Naipe */}
        {work.audios.length > 0 && (
          <Box>
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>
              Áudios de Estudo por Naipe
            </Text>

            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="xs">
              {work.audios.map((audio) => {
                const voiceKey = audio.voicePart?.toLowerCase() || "";
                const voiceConfig = VOICE_COLORS[voiceKey] || {
                  color: "blue",
                  label: audio.voicePart || "Áudio",
                  badge: "🎧",
                };

                const buttonLabel = formatVoiceButtonLabel(audio);

                // Verifica se este áudio corresponde ao filtro ativo ou ao naipe do usuário
                const isSelectedByFilter =
                  activeVoiceFilter &&
                  (voiceKey === activeVoiceFilter ||
                    audio.title.toLowerCase().includes(activeVoiceFilter));

                const isUserVoice =
                  currentUserVoice &&
                  (voiceKey === currentUserVoice.toLowerCase() ||
                    audio.title.toLowerCase().includes(currentUserVoice.toLowerCase()));

                return (
                  <Button
                    key={audio.id}
                    component={Link}
                    href={`/ensaios/material/${audio.id}`}
                    variant={isSelectedByFilter ? "filled" : isUserVoice ? "light" : "outline"}
                    color={voiceConfig.color}
                    size="xs"
                    radius="md"
                    fullWidth
                    justify="space-between"
                    leftSection={
                      <Group gap={4}>
                        <IconPlayerPlay size={12} />
                        <span>{voiceConfig.badge}</span>
                      </Group>
                    }
                    rightSection={
                      isUserVoice && !isSelectedByFilter ? (
                        <Tooltip label="Seu naipe de ensaio">
                          <ThemeIcon size={16} radius="xl" color="yellow.8" variant="light">
                            <IconSparkles size={10} />
                          </ThemeIcon>
                        </Tooltip>
                      ) : null
                    }
                    style={{
                      height: "auto",
                      minHeight: 34,
                      paddingTop: 6,
                      paddingBottom: 6,
                      fontWeight: isSelectedByFilter || isUserVoice ? 700 : 500,
                      boxShadow: isSelectedByFilter
                        ? "0 2px 8px rgba(0,0,0,0.12)"
                        : undefined,
                    }}
                  >
                    <Text size="xs" truncate style={{ maxWidth: 140 }}>
                      {buttonLabel}
                    </Text>
                  </Button>
                );
              })}
            </SimpleGrid>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
