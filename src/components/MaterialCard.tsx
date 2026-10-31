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
} from "@mantine/core";
import {
  IconHeadphones,
  IconFileText,
  IconNotes,
  IconArrowRight,
  IconCalendar,
} from "@tabler/icons-react";
import type { Material } from "./types";

const typeConfig: Record<
  Material["type"],
  { label: string; color: string; icon: typeof IconHeadphones }
> = {
  audio: {
    label: "Áudio de Ensaio",
    color: "blue",
    icon: IconHeadphones,
  },
  score: {
    label: "Partitura",
    color: "orange",
    icon: IconFileText,
  },
  lyric: {
    label: "Letra",
    color: "yellow",
    icon: IconNotes,
  },
};

const voiceColors: Record<string, string> = {
  soprano: "pink",
  contralto: "grape",
  tenor: "cyan",
  baixo: "indigo",
  baritono: "teal",
  todos: "green",
  solo: "violet",
  guia: "yellow",
};

export function MaterialCard({ material }: { material: Material }) {
  const config = typeConfig[material.type] || typeConfig.audio;
  const Icon = config.icon;

  return (
    <Card
      withBorder
      shadow="xs"
      padding="lg"
      radius="md"
      component={Link}
      href={`/ensaios/material/${material.id}`}
      style={{
        textDecoration: "none",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      className="hover:shadow-md hover:border-canarinhos-gold"
    >
      <div>
        <Group justify="space-between" align="center" mb="sm">
          <Group gap="xs">
            <ThemeIcon size={32} radius="md" color={config.color} variant="light">
              <Icon size={18} />
            </ThemeIcon>
            <Badge size="sm" color={config.color} variant="light">
              {config.label}
            </Badge>
          </Group>

          {material.voicePart && (
            <Badge
              size="xs"
              variant="outline"
              color={voiceColors[material.voicePart.toLowerCase()] || "gray"}
              style={{ textTransform: "capitalize" }}
            >
              {material.voicePart}
            </Badge>
          )}
        </Group>

        <Text fw={700} size="md" c="dark.8" lh={1.3} mb="xs">
          {material.title}
        </Text>
      </div>

      <Box mt="md" pt="xs" style={{ borderTop: "1px solid #f1f5f9" }}>
        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            {new Date(material.uploadedAt).toLocaleDateString("pt-BR")}
          </Text>

          <Group gap={4} c="canarinhosBlue.7">
            <Text size="xs" fw={700}>
              Abrir
            </Text>
            <IconArrowRight size={14} />
          </Group>
        </Group>
      </Box>
    </Card>
  );
}
