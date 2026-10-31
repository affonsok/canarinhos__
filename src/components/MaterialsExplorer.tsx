"use client";

import { useState, useMemo, useEffect } from "react";
import {
  TextInput,
  SegmentedControl,
  Select,
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
  IconCheck,
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
  // REGRA DE OURO: Se o coralista tem um naipe cadastrado, a visualização DELE é a PADRÃO (DEFAULT)!
  const hasVoice = Boolean(currentUserVoice);
  const normalizedUserVoice = currentUserVoice ? currentUserVoice.toLowerCase() : "";

  const [onlyMyVoice, setOnlyMyVoice] = useState<boolean>(hasVoice);
  const [selectedVoice, setSelectedVoice] = useState<string>(
    externalVoiceFilter || (hasVoice ? normalizedUserVoice : "all")
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMissa, setSelectedMissa] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "accordion" | "flat">("cards");

  // Reage a cliques externos de filtro por voz (ex: vindo do Bento Hero Cockpit)
  useEffect(() => {
    if (externalVoiceFilter) {
      setSelectedVoice(externalVoiceFilter);
      if (externalVoiceFilter === normalizedUserVoice) {
        setOnlyMyVoice(true);
      } else {
        setOnlyMyVoice(false);
      }
    }
  }, [externalVoiceFilter, normalizedUserVoice]);

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

      // 3. Filtro de Naipe Vocal (Padronizado como Meu Naipe por Default)
      if (selectedVoice !== "all") {
        const voiceQuery = selectedVoice.toLowerCase();
        const hasVoiceInAudios = work.audios.some((a) => {
          const v = a.voicePart?.toLowerCase() || "";
          const t = a.title.toLowerCase();
          return v === voiceQuery || t.includes(voiceQuery);
        });
        if (!hasVoiceInAudios) return false;
      }

      // 4. Busca Textual
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

  // Alterna entre ver apenas o naipe do coralista vs ver todo o repertório
  const toggleOnlyMyVoice = (enable: boolean) => {
    setOnlyMyVoice(enable);
    if (enable && hasVoice) {
      setSelectedVoice(normalizedUserVoice);
    } else {
      setSelectedVoice("all");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedMissa("all");
    setSelectedVoice("all");
    setOnlyMyVoice(false);
  };

  const isFiltered =
    search.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedMissa !== "all" ||
    selectedVoice !== "all";

  return (
    <div id="repertorio" className="space-y-3.5">
      {/* ============================================================== */}
      {/* 1. MASTER TOGGLE BENTO MOBILE-FIRST: "APENAS MEU NAIPE" (DEFAULT) */}
      {/* ============================================================== */}
      {hasVoice && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0c1e38] text-white border border-[#1e3a5f] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9a227] text-slate-950 flex items-center justify-center font-black text-base shrink-0 shadow-2xs">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-extrabold text-white">
                  {onlyMyVoice
                    ? `Modo Padrão Ativo: Apenas ${currentUserVoice?.toUpperCase()}`
                    : "Exibindo Todo o Repertório do Coro"}
                </span>
                {onlyMyVoice && (
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#c9a227]/20 text-[#fde047] border border-[#c9a227]/30 px-2 py-0.5 rounded-full">
                    Padrão
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {onlyMyVoice
                  ? `Mostrando somente as músicas que possuem faixas para o seu naipe.`
                  : "Todas as 25 obras e todos os naipes estão visíveis."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onlyMyVoice ? (
              <button
                type="button"
                onClick={() => toggleOnlyMyVoice(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold border border-white/20 transition-all text-center min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <span>🌟 Ver Todo o Repertório</span>
                <span className="text-[11px] text-slate-300">({allWorks.length})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => toggleOnlyMyVoice(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#c9a227] hover:bg-[#b58f1f] active:scale-95 text-slate-950 text-xs font-black transition-all shadow-sm text-center min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <span>🎯 Filtrar Meu Naipe</span>
                <span className="capitalize font-bold">({currentUserVoice})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DECK DE COLEÇÕES BENTO (Ponto de Acesso Rápido)             */}
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
      {/* 3. CONSOLE DE CONTROLE COMPACTO (Busca, Naipe & Modos)         */}
      {/* ============================================================== */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
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
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] ${
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

        {/* Linha Principal de Ferramentas: Busca + Seletor de Naipe + Alternador de Visualização */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Campo de Busca Rápida */}
          <div className="relative flex-1 min-w-[200px]">
            <TextInput
              placeholder="Buscar por obra, compositor (Mozart, Rutter...)..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<IconSearch size={16} className="text-slate-400" />}
              rightSection={
                search ? (
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="gray"
                    onClick={() => setSearch("")}
                    aria-label="Limpar busca"
                  >
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
              radius="md"
              size="md"
              styles={{
                input: {
                  backgroundColor: "#f8fafc",
                  borderColor: "#e2e8f0",
                  fontSize: "14px",
                  height: "44px",
                },
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filtro Rápido por Naipe */}
            <div className="flex-1 sm:flex-none sm:w-[170px]">
              <Select
                placeholder="Naipe Vocal"
                value={selectedVoice}
                onChange={(val) => {
                  const newVoice = val || "all";
                  setSelectedVoice(newVoice);
                  if (hasVoice && newVoice === normalizedUserVoice) {
                    setOnlyMyVoice(true);
                  } else {
                    setOnlyMyVoice(false);
                  }
                }}
                radius="md"
                size="md"
                leftSection={<IconFilter size={15} className="text-slate-400" />}
                data={[
                  { label: "Todos os Naipes", value: "all" },
                  { label: "🌸 Soprano", value: "soprano" },
                  { label: "🍇 Contralto", value: "contralto" },
                  { label: "🔷 Tenor", value: "tenor" },
                  { label: "🟦 Baixo", value: "baixo" },
                  { label: "🎵 Barítono", value: "baritono" },
                ]}
                styles={{
                  input: {
                    backgroundColor: "#f8fafc",
                    borderColor: "#e2e8f0",
                    fontSize: "13px",
                    fontWeight: 700,
                    height: "44px",
                  },
                }}
              />
            </div>

            {/* Alternador do Modo de Exibição */}
            <SegmentedControl
              size="sm"
              radius="md"
              value={viewMode}
              onChange={(val) => setViewMode(val as any)}
              data={[
                {
                  value: "cards",
                  label: (
                    <div className="flex items-center justify-center gap-1 font-bold py-1">
                      <IconLayoutGrid size={15} />
                      <span className="hidden md:inline">Obras</span>
                    </div>
                  ),
                },
                {
                  value: "accordion",
                  label: (
                    <div className="flex items-center justify-center gap-1 font-bold py-1">
                      <IconFolder size={15} />
                      <span className="hidden md:inline">Pastas</span>
                    </div>
                  ),
                },
                {
                  value: "flat",
                  label: (
                    <div className="flex items-center justify-center gap-1 font-bold py-1">
                      <IconListDetails size={15} />
                      <span className="hidden md:inline">Lista</span>
                    </div>
                  ),
                },
              ]}
              styles={{
                root: {
                  backgroundColor: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                },
              }}
            />
          </div>
        </div>

        {/* Linha de Feedback e Limpeza de Filtros */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-1.5 border-t border-slate-100 gap-1.5">
          <span className="text-slate-500 font-medium">
            Exibindo <strong className="text-slate-900">{filteredWorks.length}</strong> de{" "}
            {allWorks.length} obras musicais{" "}
            {onlyMyVoice && (
              <span className="text-blue-900 font-bold">
                (filtrado para {currentUserVoice})
              </span>
            )}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 underline flex items-center gap-1 py-1"
            >
              <IconX size={12} />
              Limpar todos os filtros
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. GRADE BENTO PRINCIPAL DE OBRAS MUSICAIS                     */}
      {/* ============================================================== */}
      {filteredWorks.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/90 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <IconMusic size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Nenhuma obra encontrada para estes filtros
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
            {onlyMyVoice
              ? `Não há áudios marcados como ${currentUserVoice} para a busca atual. Toque no botão abaixo para ver todo o repertório do coro.`
              : "Tente buscar por outro termo ou limpar os filtros de coleção e naipe."}
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2.5 rounded-xl bg-[#0c1e38] text-white text-xs font-bold hover:bg-[#162c4a] transition-colors min-h-[44px]"
          >
            Ver Todo o Repertório do Coro
          </button>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
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
