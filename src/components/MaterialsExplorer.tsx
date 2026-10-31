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
  Button,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconSearch,
  IconMusic,
  IconHeadphones,
  IconFileText,
  IconFilter,
  IconX,
  IconSparkles,
  IconLayoutGrid,
  IconListDetails,
  IconFolder,
} from "@tabler/icons-react";
import { MaterialCard } from "./MaterialCard";
import { SongCard } from "./SongCard";
import { CategoryAccordionView } from "./CategoryAccordionView";
import type { Material } from "./types";
import {
  groupMaterialsIntoWorks,
  CATEGORY_INFO,
  VOICE_COLORS,
  type RepertoireWork,
} from "@/lib/repertoireMetadata";

interface MaterialsExplorerProps {
  initialMaterials: Material[];
  currentUserVoice?: string | null;
}

export function MaterialsExplorer({
  initialMaterials,
  currentUserVoice,
}: MaterialsExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMissa, setSelectedMissa] = useState<string>("all");
  const [selectedVoice, setSelectedVoice] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "accordion" | "flat">("cards");

  // Agrupa os 97 materiais nas 25 obras musicais estruturadas
  const allWorks = useMemo(() => {
    return groupMaterialsIntoWorks(initialMaterials);
  }, [initialMaterials]);

  // Contadores por categoria
  const categoryCounts = useMemo(() => {
    return {
      all: allWorks.length,
      natal: allWorks.filter((w) => w.category === "natal").length,
      missas: allWorks.filter((w) => w.category === "missas").length,
      classicos: allWorks.filter((w) => w.category === "classicos").length,
      mpb: allWorks.filter((w) => w.category === "mpb").length,
    };
  }, [allWorks]);

  // Contadores de submissas
  const missaCounts = useMemo(() => {
    return {
      all: allWorks.filter((w) => w.category === "missas").length,
      agosto: allWorks.filter(
        (w) => w.category === "missas" && w.subCategory === "Missa de Agosto"
      ).length,
      maio: allWorks.filter(
        (w) => w.category === "missas" && w.subCategory === "Missa de Maio"
      ).length,
      setembro: allWorks.filter(
        (w) => w.category === "missas" && w.subCategory === "Missa de Setembro"
      ).length,
    };
  }, [allWorks]);

  // Filtra as obras musicais com base nos critérios selecionados
  const filteredWorks = useMemo(() => {
    return allWorks.filter((work) => {
      // 1. Filtro de Categoria Principal
      if (selectedCategory !== "all" && work.category !== selectedCategory) {
        return false;
      }

      // 2. Sub-filtro de Missas
      if (selectedCategory === "missas" && selectedMissa !== "all") {
        if (work.subCategory !== selectedMissa) return false;
      }

      // 3. Filtro de Naipe
      if (selectedVoice !== "all") {
        const voiceQuery = selectedVoice.toLowerCase();
        const hasVoiceInAudios = work.audios.some((a) => {
          const v = a.voicePart?.toLowerCase() || "";
          const t = a.title.toLowerCase();
          return v === voiceQuery || t.includes(voiceQuery);
        });
        if (!hasVoiceInAudios) return false;
      }

      // 4. Busca Textual (Nome da música, compositor, subtítulo ou materiais)
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = work.name.toLowerCase().includes(query);
        const matchesSub = work.subtitle?.toLowerCase().includes(query) ?? false;
        const matchesCat = work.categoryLabel.toLowerCase().includes(query);
        const matchesMaterials = work.allMaterials.some((m) =>
          m.title.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesSub && !matchesCat && !matchesMaterials) {
          return false;
        }
      }

      return true;
    });
  }, [allWorks, search, selectedCategory, selectedMissa, selectedVoice]);

  // Materiais filtrados para a visão "flat"
  const flatMaterials = useMemo(() => {
    return filteredWorks.flatMap((w) => w.allMaterials);
  }, [filteredWorks]);

  // Limpa todos os filtros
  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedMissa("all");
    setSelectedVoice("all");
  };

  const isFiltered =
    search.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedMissa !== "all" ||
    selectedVoice !== "all";

  return (
    <Stack gap="lg">
      {/* Barra de Filtros, Categorias e Modos de Visão */}
      <Paper withBorder shadow="xs" p="lg" radius="md" bg="white">
        <Stack gap="md">
          {/* Linha 1: Categorias Principais (Abas visuais dos Canarinhos) */}
          <Group justify="space-between" align="center" wrap="wrap" gap="xs">
            <Group gap="xs" wrap="wrap">
              <Button
                size="xs"
                radius="xl"
                variant={selectedCategory === "all" ? "filled" : "light"}
                color="canarinhosBlue"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedMissa("all");
                }}
              >
                🌟 Todas as Obras ({categoryCounts.all})
              </Button>

              <Button
                size="xs"
                radius="xl"
                variant={selectedCategory === "natal" ? "filled" : "light"}
                color="red"
                onClick={() => {
                  setSelectedCategory("natal");
                  setSelectedMissa("all");
                }}
              >
                🎄 Natal 2026 ({categoryCounts.natal})
              </Button>

              <Button
                size="xs"
                radius="xl"
                variant={selectedCategory === "missas" ? "filled" : "light"}
                color="blue"
                onClick={() => setSelectedCategory("missas")}
              >
                ⛪ Missas & Liturgia ({categoryCounts.missas})
              </Button>

              <Button
                size="xs"
                radius="xl"
                variant={selectedCategory === "classicos" ? "filled" : "light"}
                color="violet"
                onClick={() => {
                  setSelectedCategory("classicos");
                  setSelectedMissa("all");
                }}
              >
                🎼 Clássico & Sacro ({categoryCounts.classicos})
              </Button>

              <Button
                size="xs"
                radius="xl"
                variant={selectedCategory === "mpb" ? "filled" : "light"}
                color="teal"
                onClick={() => {
                  setSelectedCategory("mpb");
                  setSelectedMissa("all");
                }}
              >
                🎵 MPB & Coral ({categoryCounts.mpb})
              </Button>
            </Group>

            {/* Alternador do Modo de Visão */}
            <SegmentedControl
              size="xs"
              radius="md"
              value={viewMode}
              onChange={(val) => setViewMode(val as any)}
              data={[
                {
                  value: "cards",
                  label: (
                    <Group gap={4}>
                      <IconLayoutGrid size={14} />
                      <span>Por Obra</span>
                    </Group>
                  ),
                },
                {
                  value: "accordion",
                  label: (
                    <Group gap={4}>
                      <IconFolder size={14} />
                      <span>Pastas / Sanfona</span>
                    </Group>
                  ),
                },
                {
                  value: "flat",
                  label: (
                    <Group gap={4}>
                      <IconListDetails size={14} />
                      <span>Arquivos Avulsos</span>
                    </Group>
                  ),
                },
              ]}
            />
          </Group>

          {/* Sub-filtro de Missas (aparece quando categoria é Missas) */}
          {selectedCategory === "missas" && (
            <Group
              gap="xs"
              p="xs"
              style={{
                backgroundColor: "#f0f7ff",
                borderRadius: "8px",
                border: "1px dashed #bae6fd",
              }}
            >
              <Text size="xs" fw={700} c="canarinhosBlue.7">
                Filtrar Celebração:
              </Text>
              <Button
                size="xs"
                radius="md"
                variant={selectedMissa === "all" ? "filled" : "subtle"}
                color="blue"
                onClick={() => setSelectedMissa("all")}
              >
                Todas as Missas ({missaCounts.all})
              </Button>
              <Button
                size="xs"
                radius="md"
                variant={selectedMissa === "Missa de Agosto" ? "filled" : "subtle"}
                color="blue"
                onClick={() => setSelectedMissa("Missa de Agosto")}
              >
                Missa de Agosto ({missaCounts.agosto})
              </Button>
              <Button
                size="xs"
                radius="md"
                variant={selectedMissa === "Missa de Maio" ? "filled" : "subtle"}
                color="blue"
                onClick={() => setSelectedMissa("Missa de Maio")}
              >
                Missa de Maio ({missaCounts.maio})
              </Button>
              <Button
                size="xs"
                radius="md"
                variant={selectedMissa === "Missa de Setembro" ? "filled" : "subtle"}
                color="blue"
                onClick={() => setSelectedMissa("Missa de Setembro")}
              >
                Missa de Setembro ({missaCounts.setembro})
              </Button>
            </Group>
          )}

          {/* Linha 2: Busca Textual + Filtro de Naipe */}
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            {/* Campo de Busca */}
            <TextInput
              placeholder="Buscar por nome da música, compositor (ex: Mozart, Rutter), trecho..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              rightSection={
                search ? (
                  <ActionIcon size="xs" variant="subtle" color="gray" onClick={() => setSearch("")}>
                    <IconX size={12} />
                  </ActionIcon>
                ) : null
              }
              radius="md"
              style={{ flex: 1, minWidth: 260 }}
            />

            {/* Filtro Rápido por Naipe */}
            <Select
              placeholder="Filtrar por Naipe"
              value={selectedVoice}
              onChange={(val) => setSelectedVoice(val || "all")}
              radius="md"
              leftSection={<IconFilter size={14} />}
              data={[
                { label: "Todos os Naipes", value: "all" },
                { label: "🌸 Soprano", value: "soprano" },
                { label: "🍇 Contralto", value: "contralto" },
                { label: "🔷 Tenor", value: "tenor" },
                { label: "🟦 Baixo", value: "baixo" },
                { label: "🎵 Barítono", value: "baritono" },
              ]}
              style={{ width: 180 }}
            />

            {/* Botão Rápido: Meu Naipe */}
            {currentUserVoice && (
              <Button
                size="sm"
                radius="md"
                variant={selectedVoice.toLowerCase() === currentUserVoice.toLowerCase() ? "filled" : "outline"}
                color="yellow.8"
                leftSection={<IconSparkles size={14} />}
                onClick={() => {
                  if (selectedVoice.toLowerCase() === currentUserVoice.toLowerCase()) {
                    setSelectedVoice("all");
                  } else {
                    setSelectedVoice(currentUserVoice.toLowerCase());
                  }
                }}
              >
                Meu Naipe: {currentUserVoice}
              </Button>
            )}
          </Group>

          {/* Linha 3: Resumo dos Resultados e Limpar Filtros */}
          <Group justify="space-between" align="center" pt="xs" style={{ borderTop: "1px solid #f1f5f9" }}>
            <Text size="xs" c="dimmed">
              Exibindo <strong>{filteredWorks.length}</strong> de {allWorks.length} obras musicais{" "}
              (<strong>{flatMaterials.length}</strong> materiais de estudo disponíveis)
            </Text>

            {isFiltered && (
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                leftSection={<IconX size={12} />}
                onClick={handleClearFilters}
              >
                Limpar todos os filtros
              </Button>
            )}
          </Group>
        </Stack>
      </Paper>

      {/* Conteúdo Principal de Acordo com o Modo de Visão */}
      {filteredWorks.length === 0 ? (
        <Paper withBorder p={40} radius="md" ta="center" bg="white">
          <ThemeIcon size={48} radius="xl" color="gray" variant="light" mb="md">
            <IconMusic size={24} />
          </ThemeIcon>
          <Text fw={700} size="md" c="dark.7">
            Nenhuma música encontrada
          </Text>
          <Text size="sm" c="dimmed" mt={4} mb="md">
            Tente buscar por outro termo ou limpar os filtros de categoria e naipe.
          </Text>
          <Button size="xs" variant="outline" color="canarinhosBlue" onClick={handleClearFilters}>
            Ver todo o repertório
          </Button>
        </Paper>
      ) : viewMode === "cards" ? (
        /* Visão 1: Cards Agrupados por Música (Obras) */
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {filteredWorks.map((work) => (
            <SongCard
              key={work.id}
              work={work}
              selectedVoice={selectedVoice}
              currentUserVoice={currentUserVoice}
            />
          ))}
        </SimpleGrid>
      ) : viewMode === "accordion" ? (
        /* Visão 2: Sanfona / Pastas por Coleção Litúrgica e Temática */
        <CategoryAccordionView
          works={filteredWorks}
          selectedVoice={selectedVoice}
          currentUserVoice={currentUserVoice}
        />
      ) : (
        /* Visão 3: Grade Plana de Arquivos Avulsos (para visualização individual) */
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {flatMaterials.map((m) => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
