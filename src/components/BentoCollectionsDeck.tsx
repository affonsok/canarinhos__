"use client";

import { Group, Text, Badge, Box } from "@mantine/core";
import {
  IconSparkles,
  IconCross,
  IconMusic,
  IconHeadphones,
  IconCheck,
} from "@tabler/icons-react";

interface BentoCollectionsDeckProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  counts: {
    all: number;
    natal: number;
    missas: number;
    classicos: number;
    mpb: number;
  };
}

export function BentoCollectionsDeck({
  selectedCategory,
  onSelectCategory,
  counts,
}: BentoCollectionsDeckProps) {
  const cards = [
    {
      id: "all",
      label: "Todas as Obras",
      count: counts.all,
      subtitle: "Acervo Completo",
      icon: "🌟",
      borderActive: "border-[#1e3a5f]",
      bgActive: "bg-[#edf4fb]",
      indicator: "bg-[#1e3a5f]",
    },
    {
      id: "natal",
      label: "Natal 2026",
      count: counts.natal,
      subtitle: "Especial de Fim de Ano",
      icon: "🎄",
      borderActive: "border-red-600",
      bgActive: "bg-red-50",
      indicator: "bg-red-600",
    },
    {
      id: "missas",
      label: "Missas & Liturgia",
      count: counts.missas,
      subtitle: "Simplex, Maio, Agosto, Set.",
      icon: "⛪",
      borderActive: "border-blue-700",
      bgActive: "bg-blue-50",
      indicator: "bg-blue-700",
    },
    {
      id: "classicos",
      label: "Clássico & Sacro",
      count: counts.classicos,
      subtitle: "Mozart, Aguiar, Rutter",
      icon: "🎼",
      borderActive: "border-purple-700",
      bgActive: "bg-purple-50",
      indicator: "bg-purple-700",
    },
    {
      id: "mpb",
      label: "MPB & Coral",
      count: counts.mpb,
      subtitle: "Barbatuques, Pixinguinha",
      icon: "🎵",
      borderActive: "border-teal-700",
      bgActive: "bg-teal-50",
      indicator: "bg-teal-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
      {cards.map((card) => {
        const isSelected = selectedCategory === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCategory(card.id)}
            className={`flex flex-col text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
              isSelected
                ? `${card.bgActive} ${card.borderActive} shadow-sm ring-1 ring-inset ring-black/5`
                : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70"
            }`}
          >
            {/* Indicador de Seleção Ativa no topo da célula */}
            {isSelected && (
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${card.indicator}`}
              />
            )}

            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-lg leading-none">{card.icon}</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  isSelected
                    ? "bg-white/80 text-slate-900 font-extrabold shadow-2xs"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                }`}
              >
                {card.count} {card.count === 1 ? "obra" : "obras"}
              </span>
            </div>

            <span
              className={`text-xs font-bold leading-snug truncate ${
                isSelected ? "text-slate-950 font-extrabold" : "text-slate-800"
              }`}
            >
              {card.label}
            </span>

            <span className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              {card.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}
