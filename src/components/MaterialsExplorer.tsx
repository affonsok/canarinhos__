"use client";

import { useState, useMemo } from "react";
import {
  TextInput,
  SegmentedControl,
  Select,
  Group,
  Text,
  Badge,
  Stack,
  Box,
  Button,
  ActionIcon,
} from "@mantine/core";
import {
  IconSearch,
  IconMusic,
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
import { BentoCollectionsDeck } from "./BentoCollectionsDeck";
import type { Material } from "./types";
import {
  groupMaterialsIntoWorks,
  type RepertoireWork,
} from "@/lib/repertoireMetadata";

interface MaterialsExplorerProps {
  initialMaterials: Material[];
  currentUserVoice?: string | null;
  externalVoiceFilter?: string | null;
}

export function MaterialsExplorer({
  initialMaterials,
  currentUserVoice,
  externalVoiceFilter,
}: MaterialsExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMissa, setSelectedMissa] = useState<string>("all");
  const [selectedVoice, setSelectedVoice] = useState<string>(
    externalVoiceFilter || "all"
  );
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
    <div id="repertorio" className="space-y-4">
      {/* ============================================================== */}
      {/* 1. DECK DE COLEÇÕES BENTO (Ponto de Acesso Rápido)             */}
      {/* ============================================================== */}
      <BentoCollectionsDeck
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat !== "missas") setSelectedMissa("all");
        }}
        counts={categoryCounts}
      />

      {/* ============================================================== */}
      {/* 2. CONSOLE DE CONTROLE COMPACTO (Busca, Naipe & Modos)         */}
      {/* ============================================================== */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        {/* Sub-filtro de Missas (aparece apenas quando a coleção de Missas está ativa) */}
        {selectedCategory === "missas" && (
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs">
            <span className="font-bold text-blue-900 mr-1">
              Celebrar:
            </span>
            {[
              { id: "all", label: `Todas as Missas (${missaCounts.all})` },
              { id: "Missa de Agosto", label: `Missa de Agosto (${missaCounts.agosto})` },
              { id: "Missa de Maio", label: `Missa de Maio (${missaCounts.maio})` },
              { id: "Missa de Setembro", label: `Missa de Setembro (${missaCounts.setembro})` },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedMissa(sub.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedMissa === sub.id
                    ? "bg-[#1e3a5f] text-white shadow-2xs"
                    : "bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* Linha Principal de Ferramentas */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Campo de Busca Rápida */}
          <div className="relative flex-1 min-w-[240px]">
            <TextInput
              placeholder="Buscar por obra, compositor (Mozart, Rutter...), trecho..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<IconSearch size={15} className="text-slate-400" />}
              rightSection={
                search ? (
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => setSearch("")}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                ) : null
              }
              radius="md"
              size="sm"
              styles={{
                input: {
                  backgroundColor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  fontSize: "13px",
                },
              }}
            />
          </div>

          {/* Filtro Rápido por Naipe */}
          <div className="flex items-center gap-2">
            <Select
              placeholder="Filtrar Naipe"
              value={selectedVoice}
              onChange={(val) => setSelectedVoice(val || "all")}
              radius="md"
              size="sm"
              leftSection={<IconFilter size={14} className="text-slate-400" />}
              data={[
                { label: "Todos os Naipes", value: "all" },
                { label: "🌸 Soprano", value: "soprano" },
                { label: "🍇 Contralto", value: "contralto" },
                { label: "🔷 Tenor", value: "tenor" },
                { label: "🟦 Baixo", value: "baixo" },
                { label: "🎵 Barítono", value: "baritono" },
              ]}
              style={{ width: 165 }}
              styles={{
                input: {
                  backgroundColor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  fontSize: "13px",
                  fontWeight: 600,
                },
              }}
            />

            {/* Alternador do Modo de Exibição */}
            <SegmentedControl
              size="xs"
              radius="md"
              value={viewMode}
              onChange={(val) => setViewMode(val as any)}
              data={[
                {
                  value: "cards",
                  label: (
                    <div className="flex items-center gap-1 font-semibold">
                      <IconLayoutGrid size={13} />
                      <span className="hidden md:inline">Obras</span>
                    </div>
                  ),
                },
                {
                  value: "accordion",
                  label: (
                    <div className="flex items-center gap-1 font-semibold">
                      <IconFolder size={13} />
                      <span className="hidden md:inline">Pastas</span>
                    </div>
                  ),
                },
                {
                  value: "flat",
                  label: (
                    <div className="flex items-center gap-1 font-semibold">
                      <IconListDetails size={13} />
                      <span className="hidden md:inline">Lista</span>
                    </div>
                  ),
                },
              ]}
              styles={{
                root: {
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                },
              }}
            />
          </div>
        </div>

        {/* Linha de Feedback e Limpeza de Filtros */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-medium">
            Exibindo <strong className="text-slate-900">{filteredWorks.length}</strong> de{" "}
            {allWorks.length} obras musicais ({flatMaterials.length} materiais disponíveis)
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline flex items-center gap-1"
            >
              <IconX size={12} />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. GRADE BENTO PRINCIPAL DE OBRAS MUSICAIS                     */}
      {/* ============================================================== */}
      {filteredWorks.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white border border-slate-200/90 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <IconMusic size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Nenhuma obra encontrada para estes filtros
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Tente buscar por outro termo ou limpar os filtros de coleção e naipe.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-3.5 py-1.5 rounded-xl bg-[#1e3a5f] text-white text-xs font-bold hover:bg-[#162c4a] transition-colors"
          >
            Ver Todo o Repertório
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredWorks.map((work) => (
            <SongCard
              key={work.id}
              work={work}
              selectedVoice={selectedVoice}
              currentUserVoice={currentUserVoice}
            />
          ))}
        </div>
      ) : viewMode === "accordion" ? (
        <CategoryAccordionView
          works={filteredWorks}
          selectedVoice={selectedVoice}
          currentUserVoice={currentUserVoice}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {flatMaterials.map((m) => (
            <MaterialCard key={m.id} material={m} />
          ))}
        </div>
      )}
    </div>
  );
}
