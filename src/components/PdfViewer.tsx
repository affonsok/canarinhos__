"use client";

import { Paper, Group, Text, Button, Box, ThemeIcon } from "@mantine/core";
import { IconFileText, IconExternalLink, IconDownload } from "@tabler/icons-react";

export function PdfViewer({ src, title }: { src: string; title: string }) {
  return (
    <Paper withBorder shadow="sm" radius="lg" style={{ overflow: "hidden" }} bg="white">
      {/* Barra superior de controle do PDF */}
      <Box p="md" style={{ borderBottom: "1px solid #e2e8f0" }}>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon color="orange" variant="light" size="md" radius="md">
              <IconFileText size={18} />
            </ThemeIcon>
            <Text fw={600} size="sm" c="dark.8">
              Visualizador de Partitura: {title}
            </Text>
          </Group>

          <Group gap="xs">
            <Button
              component="a"
              href={src}
              target="_blank"
              rel="noreferrer"
              variant="light"
              color="canarinhosBlue"
              size="xs"
              radius="md"
              leftSection={<IconExternalLink size={14} />}
            >
              Abrir em Nova Aba
            </Button>
            <Button
              component="a"
              href={src}
              download
              variant="outline"
              color="gray.7"
              size="xs"
              radius="md"
              leftSection={<IconDownload size={14} />}
            >
              Baixar PDF
            </Button>
          </Group>
        </Group>
      </Box>

      {/* Frame de exibição */}
      <Box style={{ position: "relative", height: "700px", width: "100%", backgroundColor: "#f8fafc" }}>
        <iframe
          src={src}
          title={title}
          style={{ width: "100%", height: "100%", border: "none" }}
          loading="lazy"
        />
      </Box>
    </Paper>
  );
}
