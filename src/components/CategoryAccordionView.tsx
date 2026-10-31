"use client";

import Link from "next/link";
import {
  Accordion,
  Paper,
  Text,
  Badge,
  Group,
  ThemeIcon,
  Button,
  Stack,
  Box,
  Divider,
} from "@mantine/core";
import {
  IconFileText,
  IconPlayerPlay,
  IconFolder,
  IconArrowRight,
} from "@tabler/icons-react";
import type { RepertoireWork } from "@/lib/repertoireMetadata";
import {
  formatVoiceButtonLabel,
  VOICE_COLORS,
} from "@/lib/repertoireMetadata";

interface CategoryAccordionViewProps {
  works: RepertoireWork[];
  selectedVoice?: string | null;
  currentUserVoice?: string | null;
}

export function CategoryAccordionView({
  works,
  selectedVoice,
  currentUserVoice,
}: CategoryAccordionViewProps) {
  // Agrupa as obras por seção lógica para o Accordion:
  // 1. Especial de Natal 2026
  // 2. Missas: Missa de Agosto
  // 3. Missas: Missa de Maio
  // 4. Missas: Missa de Setembro
  // 5. Clássicos & Sacro
  // 6. MPB & Coral Geral

  const sections: {
    id: string;
    title: string;
    icon: string;
    color: string;
    works: RepertoireWork[];
  }[] = [
    {
      id: "natal-2026",
      title: "Especial de Natal 2026",
      icon: "🎄",
      color: "red",
      works: works.filter((w) => w.category === "natal"),
    },
    {
      id: "missa-agosto",
      title: "Missa de Agosto (Missa Simplex & Solenes)",
      icon: "⛪",
      color: "blue",
      works: works.filter((w) => w.category === "missas" && w.subCategory === "Missa de Agosto"),
    },
    {
      id: "missa-maio",
      title: "Missa de Maio (Ave Maria, Mãos Abertas, Panis Angelicus)",
      icon: "⛪",
      color: "cyan",
      works: works.filter((w) => w.category === "missas" && w.subCategory === "Missa de Maio"),
    },
    {
      id: "missa-setembro",
      title: "Missa de Setembro (São Vicente de Paulo)",
      icon: "⛪",
      color: "indigo",
      works: works.filter((w) => w.category === "missas" && w.subCategory === "Missa de Setembro"),
    },
    {
      id: "classicos",
      title: "Repertório Clássico & Obras Sacras",
      icon: "🎼",
      color: "violet",
      works: works.filter((w) => w.category === "classicos"),
    },
    {
      id: "mpb",
      title: "MPB, Trilha Sonora & Repertório Geral",
      icon: "🎵",
      color: "teal",
      works: works.filter((w) => w.category === "mpb"),
    },
  ];

  // Filtra apenas seções que têm obras após os filtros de busca/naipe
  const activeSections = sections.filter((s) => s.works.length > 0);

  if (activeSections.length === 0) {
    return null;
  }

  // Por padrão, abre as seções que têm itens
  const defaultOpenedValues = activeSections.map((s) => s.id);

  return (
    <Accordion
      multiple
      defaultValue={defaultOpenedValues}
      variant="separated"
      radius="md"
    >
      {activeSections.map((sec) => (
        <Accordion.Item
          key={sec.id}
          value={sec.id}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            marginBottom: 12,
          }}
        >
          <Accordion.Control>
            <Group justify="space-between" pr="md">
              <Group gap="sm">
                <Text size="1.2rem">{sec.icon}</Text>
                <div>
                  <Text fw={700} size="md" c="dark.8">
                    {sec.title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {sec.works.length} {sec.works.length === 1 ? "música" : "músicas catalogadas"}
                  </Text>
                </div>
              </Group>

              <Badge color={sec.color} variant="light" size="sm">
                {sec.works.reduce((acc, w) => acc + w.allMaterials.length, 0)} materiais
              </Badge>
            </Group>
          </Accordion.Control>

          <Accordion.Panel>
            <Stack gap="md" pt="xs">
              {sec.works.map((work, idx) => (
                <Paper
                  key={work.id}
                  withBorder
                  p="sm"
                  radius="md"
                  style={{
                    backgroundColor: idx % 2 === 0 ? "#ffffff" : "#fbfcfe",
                    borderColor: "#f1f5f9",
                  }}
                >
                  <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
                    {/* Informações da Música */}
                    <Box style={{ flex: 1, minWidth: 220 }}>
                      <Text fw={700} size="sm" c="canarinhosBlue.7">
                        {work.name}
                      </Text>
                      {work.subtitle && (
                        <Text size="xs" c="dimmed">
                          {work.subtitle}
                        </Text>
                      )}
                    </Box>

                    {/* Botão de Partitura e Botões dos Naipes */}
                    <Group gap="xs" wrap="wrap" align="center">
                      {/* Partitura */}
                      {work.scores.length > 0 && (
                        <Button
                          component={Link}
                          href={`/ensaios/material/${work.scores[0].id}`}
                          size="xs"
                          color="orange"
                          variant="light"
                          radius="md"
                          leftSection={<IconFileText size={13} />}
                        >
                          Partitura
                        </Button>
                      )}

                      {/* Naipes */}
                      {work.audios.map((audio) => {
                        const voiceKey = audio.voicePart?.toLowerCase() || "";
                        const voiceConfig = VOICE_COLORS[voiceKey] || {
                          color: "blue",
                          badge: "🎧",
                        };

                        const buttonLabel = formatVoiceButtonLabel(audio);

                        const isSelectedByFilter =
                          selectedVoice &&
                          selectedVoice !== "all" &&
                          (voiceKey === selectedVoice.toLowerCase() ||
                            audio.title.toLowerCase().includes(selectedVoice.toLowerCase()));

                        const isUserVoice =
                          currentUserVoice &&
                          (voiceKey === currentUserVoice.toLowerCase() ||
                            audio.title.toLowerCase().includes(currentUserVoice.toLowerCase()));

                        return (
                          <Button
                            key={audio.id}
                            component={Link}
                            href={`/ensaios/material/${audio.id}`}
                            size="xs"
                            variant={isSelectedByFilter ? "filled" : isUserVoice ? "light" : "subtle"}
                            color={voiceConfig.color}
                            radius="md"
                            leftSection={<IconPlayerPlay size={11} />}
                          >
                            {buttonLabel}
                          </Button>
                        );
                      })}
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
