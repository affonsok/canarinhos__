"use client";

import Link from "next/link";
import {
  Accordion,
  Text,
  Badge,
  Group,
  Button,
} from "@mantine/core";
import {
  IconFileText,
  IconPlayerPlay,
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
  const sections = [
    {
      id: "natal-2026",
      title: "Especial de Natal 2026",
      icon: "🎄",
      color: "red",
      works: works.filter((w) => w.category === "natal"),
    },
    {
      id: "missa-agosto",
      title: "Missa de Agosto (Missa Simplex & Cantos Solenes)",
      icon: "⛪",
      color: "blue",
      works: works.filter(
        (w) => w.category === "missas" && w.subCategory === "Missa de Agosto"
      ),
    },
    {
      id: "missa-maio",
      title: "Missa de Maio (Ave Maria, Mãos Abertas, Panis Angelicus)",
      icon: "⛪",
      color: "cyan",
      works: works.filter(
        (w) => w.category === "missas" && w.subCategory === "Missa de Maio"
      ),
    },
    {
      id: "missa-setembro",
      title: "Missa de Setembro (São Vicente de Paulo)",
      icon: "⛪",
      color: "indigo",
      works: works.filter(
        (w) => w.category === "missas" && w.subCategory === "Missa de Setembro"
      ),
    },
    {
      id: "classicos",
      title: "Repertório Clássico & Motetos Sacros",
      icon: "🎼",
      color: "violet",
      works: works.filter((w) => w.category === "classicos"),
    },
    {
      id: "mpb",
      title: "MPB, Trilha Sonora & Coral Geral",
      icon: "🎵",
      color: "teal",
      works: works.filter((w) => w.category === "mpb"),
    },
  ];

  const activeSections = sections.filter((s) => s.works.length > 0);

  if (activeSections.length === 0) {
    return null;
  }

  const defaultOpenedValues = activeSections.map((s) => s.id);

  return (
    <Accordion
      multiple
      defaultValue={defaultOpenedValues}
      variant="separated"
      radius="lg"
    >
      {activeSections.map((sec) => (
        <Accordion.Item
          key={sec.id}
          value={sec.id}
          className="bg-white border border-slate-200/90 rounded-2xl mb-3 overflow-hidden shadow-2xs"
        >
          <Accordion.Control className="px-4 py-3 hover:bg-slate-50/70 transition-colors">
            <div className="flex items-center justify-between pr-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl leading-none">{sec.icon}</span>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {sec.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {sec.works.length}{" "}
                    {sec.works.length === 1 ? "música catalogada" : "músicas catalogadas"}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {sec.works.reduce((acc, w) => acc + w.allMaterials.length, 0)} materiais
              </span>
            </div>
          </Accordion.Control>

          <Accordion.Panel className="px-3 pb-3 pt-1">
            <div className="space-y-2">
              {sec.works.map((work) => (
                <div
                  key={work.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:bg-white hover:border-slate-300 transition-all"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {work.name}
                      </span>
                      {work.scores.length > 0 && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded">
                          PDF
                        </span>
                      )}
                    </div>
                    {work.subtitle && (
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {work.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {/* Botão de Partitura */}
                    {work.scores.length > 0 && (
                      <Link
                        href={`/ensaios/material/${work.scores[0].id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 transition-colors"
                      >
                        <IconFileText size={13} />
                        <span>Partitura</span>
                      </Link>
                    )}

                    {/* Naipes */}
                    {work.audios.map((audio) => {
                      const voiceKey = audio.voicePart?.toLowerCase() || "";
                      const voiceConfig = VOICE_COLORS[voiceKey] || {
                        badge: "🎧",
                      };

                      const buttonLabel = formatVoiceButtonLabel(audio);

                      const isSelectedByFilter = Boolean(
                        selectedVoice &&
                          selectedVoice !== "all" &&
                          (voiceKey === selectedVoice.toLowerCase() ||
                            audio.title.toLowerCase().includes(selectedVoice.toLowerCase()))
                      );

                      const isUserVoice = Boolean(
                        currentUserVoice &&
                          (voiceKey === currentUserVoice.toLowerCase() ||
                            audio.title.toLowerCase().includes(currentUserVoice.toLowerCase()))
                      );

                      return (
                        <Link
                          key={audio.id}
                          href={`/ensaios/material/${audio.id}`}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isSelectedByFilter
                              ? "bg-[#1e3a5f] text-white border-[#1e3a5f] font-bold"
                              : isUserVoice
                              ? "bg-[#edf4fb] text-[#1e3a5f] border-[#accdef] font-bold"
                              : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <IconPlayerPlay size={11} />
                          <span>{buttonLabel}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
