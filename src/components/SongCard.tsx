"use client";

import Link from "next/link";
import {
  IconFileText,
  IconPlayerPlay,
  IconExternalLink,
  IconSparkles,
  IconHeadphones,
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

  const normalizedUserVoice = currentUserVoice
    ? currentUserVoice.toLowerCase()
    : null;

  return (
    <div className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all relative overflow-hidden group">
      <div>
        {/* ============================================================== */}
        {/* TOPO: CATEGORIA & CONTADORES                                   */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
              style={{
                backgroundColor:
                  work.category === "natal"
                    ? "#fee2e2"
                    : work.category === "missas"
                    ? "#eff6ff"
                    : work.category === "classicos"
                    ? "#f5f3ff"
                    : "#f0fdf4",
                color:
                  work.category === "natal"
                    ? "#991b1b"
                    : work.category === "missas"
                    ? "#1e40af"
                    : work.category === "classicos"
                    ? "#5b21b6"
                    : "#166534",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <span>{work.categoryIcon}</span>
              <span>{work.subCategory || work.categoryLabel}</span>
            </span>

            {work.scores.length > 0 && (
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                📄 Partitura
              </span>
            )}
          </div>

          <span className="text-[11px] font-medium text-slate-400 shrink-0">
            {work.audios.length} {work.audios.length === 1 ? "voz" : "vozes"}
          </span>
        </div>

        {/* ============================================================== */}
        {/* TÍTULO EDITORIAL & COMPOSITOR                                  */}
        {/* ============================================================== */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight">
          {work.name}
        </h3>

        {work.subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1 mb-3.5">
            {work.subtitle}
          </p>
        )}
      </div>

      {/* ============================================================== */}
      {/* DECK DE AÇÕES COMPACTO BENTO: PARTITURA + GRADE DE NAIPES      */}
      {/* ============================================================== */}
      <div className="space-y-2 mt-2 pt-3 border-t border-slate-100">
        {/* Bloco de Partitura Integrada */}
        {work.scores.length > 0 && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <div className="w-6 h-6 rounded-md bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
                <IconFileText size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  Partitura Geral
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  Visualizar partitura em PDF
                </p>
              </div>
            </div>

            <Link
              href={`/ensaios/material/${work.scores[0].id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#c9a227] hover:bg-[#b58f1f] active:scale-95 text-slate-950 shrink-0 transition-colors shadow-2xs min-h-[38px]"
            >
              <span>Ver PDF</span>
              <IconExternalLink size={13} />
            </Link>
          </div>
        )}

        {/* Grade de Naipes de Áudio */}
        {work.audios.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Áudios de Naipe:
              </span>
              <span className="text-[10px] text-slate-400">
                Clique para praticar
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {work.audios.map((audio) => {
                const voiceKey = audio.voicePart?.toLowerCase() || "";
                const voiceConfig = VOICE_COLORS[voiceKey] || {
                  color: "blue",
                  label: audio.voicePart || "Áudio",
                  badge: "🎧",
                };

                const buttonLabel = formatVoiceButtonLabel(audio);

                const isSelectedByFilter = Boolean(
                  activeVoiceFilter &&
                    (voiceKey === activeVoiceFilter ||
                      audio.title.toLowerCase().includes(activeVoiceFilter))
                );

                const isUserVoice = Boolean(
                  normalizedUserVoice &&
                    (voiceKey === normalizedUserVoice ||
                      audio.title.toLowerCase().includes(normalizedUserVoice))
                );

                return (
                  <Link
                    key={audio.id}
                    href={`/ensaios/material/${audio.id}`}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all min-h-[44px] active:scale-98 ${
                      isSelectedByFilter
                        ? "bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-xs font-bold"
                        : isUserVoice
                        ? "bg-[#edf4fb] text-[#1e3a5f] border-[#accdef] font-bold hover:bg-[#d8e7f6]"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 pr-1">
                      <span className="text-xs shrink-0">{voiceConfig.badge}</span>
                      <span className="truncate text-xs">{buttonLabel}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isUserVoice && !isSelectedByFilter && (
                        <span
                          title="Seu Naipe"
                          className="w-1.5 h-1.5 rounded-full bg-[#c9a227]"
                        />
                      )}
                      <IconPlayerPlay
                        size={11}
                        className={
                          isSelectedByFilter
                            ? "text-[#fde047]"
                            : isUserVoice
                            ? "text-[#1e3a5f]"
                            : "text-slate-400"
                        }
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
