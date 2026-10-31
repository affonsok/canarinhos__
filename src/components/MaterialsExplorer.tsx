"use client";

import { useState, useMemo } from "react";
import {
  TextInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Group,
  Text,
  Paper,
  ThemeIcon,
  Badge,
  Stack,
  Box,
} from "@mantine/core";
import {
  IconSearch,
  IconMusic,
  IconHeadphones,
  IconFileText,
  IconFilter,
} from "@tabler/icons-react";
import { MaterialCard } from "./MaterialCard";
import type { Material } from "./types";

export function MaterialsExplorer({
  initialMaterials,
}: {
  initialMaterials: Material[];
}) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedVoice, setSelectedVoice] = useState<string | null>("all");

  const filteredMaterials = useMemo(() => {
    return initialMaterials.filter((m) => {
      // Filtro de tipo
      if (selectedType !== "all" && m.type !== selectedType) {
        return false;
      }

      // Filtro de naipe
      if (
        selectedVoice &&
        selectedVoice !== "all" &&
        m.voicePart?.toLowerCase() !== selectedVoice.toLowerCase()
      ) {
        return false;
      }

      // Filtro de busca textual
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(query);
        const matchesVoice = m.voicePart?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVoice) return false;
      }

      return true;
    });
  }, [initialMaterials, search, selectedType, selectedVoice]);

  return (
    <Stack gap="lg">
      {/* Barra de Filtros e Busca */}
      <Paper withBorder shadow="xs" p="md" radius="md" bg="white">
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          {/* Campo de Busca Rápida */}
          <TextInput
            placeholder="Buscar por música, naipe ou autor..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            radius="md"
            style={{ flex: 1, minWidth: 260 }}
          />

          {/* Seletor de Tipo (Mantine UI SegmentedControl) */}
          <SegmentedControl
            value={selectedType}
            onChange={setSelectedType}
            radius="md"
            color="canarinhosBlue"
            data={[
              { label: "Todos", value: "all" },
              {
                label: (
                  <Group gap={4}>
                    <IconHeadphones size={14} />
                    <span>Áudios</span>
                  </Group>
                ),
                value: "audio",
              },
              {
                label: (
                  <Group gap={4}>
                    <IconFileText size={14} />
                    <span>Partituras</span>
                  </Group>
                ),
                value: "score",
              },
            ]}
          />

          {/* Filtro por Naipe */}
          <Select
            placeholder="Filtrar por Naipe"
            value={selectedVoice}
            onChange={setSelectedVoice}
            radius="md"
            leftSection={<IconFilter size={14} />}
            data={[
              { label: "Todos os Naipes", value: "all" },
              { label: "Soprano", value: "soprano" },
              { label: "Contralto", value: "contralto" },
              { label: "Tenor", value: "tenor" },
              { label: "Baixo", value: "baixo" },
              { label: "Barítono", value: "baritono" },
              { label: "Todos / Tutti", value: "todos" },
            ]}
            style={{ width: 170 }}
          />
        </Group>

        <Group justify="space-between" mt="sm">
          <Text size="xs" c="dimmed">
            Exibindo <strong>{filteredMaterials.length}</strong> de{" "}
            {initialMaterials.length} materiais
          </Text>
          {(search || selectedType !== "all" || (selectedVoice && selectedVoice !== "all")) && (
            <Badge
              size="xs"
              variant="outline"
              color="gray"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSearch("");
                setSelectedType("all");
                setSelectedVoice("all");
              }}
            >
              Limpar filtros
            </Badge>
          )}
        </Group>
      </Paper>

      {/* Grid de Materiais */}
      {filteredMaterials.length === 0 ? (
        <Paper withBorder p={40} radius="md" ta="center" bg="white">
          <ThemeIcon size={48} radius="xl" color="gray" variant="light" mb="md">
            <IconMusic size={24} />
          </ThemeIcon>
          <Text fw={600} size="md" c="dark.7">
            Nenhum material encontrado
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Tente buscar por outro termo ou limpar os filtros de tipo e naipe.
          </Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {filteredMaterials.map((m) => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
