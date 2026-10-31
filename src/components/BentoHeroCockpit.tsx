"use client";

import Link from "next/link";
import {
  Button,
  Box,
} from "@mantine/core";
import {
  IconMapPin,
  IconClock,
  IconPlayerPlay,
  IconMicrophone,
  IconFileText,
  IconArrowRight,
} from "@tabler/icons-react";
import type { EventItem } from "./EventsManager";
import type { Announcement, PracticeStats } from "./types";
import type { RankingUser } from "./ChoirRanking";
import { VOICE_COLORS } from "@/lib/repertoireMetadata";

interface BentoHeroCockpitProps {
  user: {
    name?: string | null;
    email?: string | null;
    voicePart?: string | null;
  };
  stats: PracticeStats;
  nextEvent?: EventItem;
  announcements: Announcement[];
  ranking: RankingUser[];
  onQuickFilterVoice?: (voice: string) => void;
}

export function BentoHeroCockpit({
  user,
  stats,
  nextEvent,
  announcements,
  ranking,
  onQuickFilterVoice,
}: BentoHeroCockpitProps) {
  const userVoice = user.voicePart ? user.voicePart.toLowerCase() : "geral";
  const voiceConfig = VOICE_COLORS[userVoice] || {
    color: "blue",
    label: user.voicePart || "Coralista",
    badge: "",
  };

  // Encontra a posição do usuário no ranking
  const userRankData = ranking.find(
    (r) =>
      r.name.toLowerCase() === (user.name || "").toLowerCase() ||
      r.voicePart.toLowerCase() === userVoice
  ) || ranking[0];

  const primaryAnnouncement = announcements[0];

  // Identifica a primeira música da voz do usuário no próximo evento
  const userVoiceMaterialInEvent = nextEvent?.materials.find((m) => {
    if (m.type !== "audio") return false;
    const v = m.voicePart?.toLowerCase() || "";
    const t = m.title.toLowerCase();
    return v === userVoice || t.includes(userVoice);
  }) || nextEvent?.materials[0];

  return (
    <Box mb="lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* ============================================================== */}
        {/* BLOCO HERO PRINCIPAL (8 Colunas): O CENTRO DE GRAVIDADE DO CORAL */}
        {/* ============================================================== */}
        <div className="lg:col-span-8 flex flex-col justify-between p-5 md:p-6 rounded-2xl bg-[#0c1e38] text-white border border-[#1e3a5f] shadow-sm relative overflow-hidden">
          {/* Elemento gráfico de fundo sutil (grid de partitura/ondas sem clichês de IA) */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#fff 1px, transparent 1px), radial-gradient(#fff 1px, #0c1e38 1px)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 12px 12px",
            }}
          />

          <div className="relative z-10">
            {/* Tag de contexto & status */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#c9a227]/20 text-[#fde047] border border-[#c9a227]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fde047] animate-pulse" />
                  Próximo Compromisso do Coro
                </span>
                {nextEvent && (
                  <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                    {new Date(nextEvent.eventDate).toLocaleDateString("pt-BR", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                )}
              </div>

              {user.voicePart && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-white/10 text-slate-200 border border-white/10 inline-flex items-center gap-1.5">
                  <IconMicrophone size={13} className="text-[#fde047]" />
                  <span>
                    Naipe Convocado: <strong className="text-white capitalize">{user.voicePart}</strong>
                  </span>
                </span>
              )}
            </div>

            {/* Título de Impacto: O Evento */}
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight text-white leading-snug mb-1.5">
              {nextEvent ? nextEvent.title : "Temporada Coral Canarinhos 2026"}
            </h2>

            {nextEvent?.description && (
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl mb-4 leading-relaxed">
                {nextEvent.description}
              </p>
            )}

            {/* Metadados de Local e Horário */}
            {nextEvent && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-5">
                {nextEvent.location && (
                  <div className="flex items-center gap-1.5">
                    <IconMapPin size={14} className="text-[#c9a227]" />
                    <span>{nextEvent.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <IconClock size={14} className="text-[#c9a227]" />
                  <span>
                    {new Date(nextEvent.eventDate).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    horas
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconFileText size={14} className="text-slate-400" />
                  <span>
                    {nextEvent.materials.length} obra(s) no repertório do evento
                  </span>
                </div>
              </div>
            )}

            {/* Músicas Convocadas no Evento com acesso direto */}
            {nextEvent && nextEvent.materials.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 backdrop-blur-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Obras em ensaio prioritário para esta celebração:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {nextEvent.materials.slice(0, 4).map((m) => (
                    <Link
                      key={m.id}
                      href={`/ensaios/material/${m.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                    >
                      <IconPlayerPlay size={11} className="text-[#fde047]" />
                      <span className="truncate max-w-[180px]">{m.title}</span>
                      {m.voicePart && (
                        <span className="text-[10px] text-slate-300 capitalize">
                          ({m.voicePart})
                        </span>
                      )}
                    </Link>
                  ))}
                  {nextEvent.materials.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs text-slate-400">
                      +{nextEvent.materials.length - 4} obras
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Barra de Ação de Impacto */}
          <div className="relative z-10 pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
            <div className="text-xs text-slate-300">
              Cantor conectado:{" "}
              <strong className="text-white font-semibold">
                {user.name || user.email}
              </strong>
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              {userVoiceMaterialInEvent ? (
                <Button
                  component={Link}
                  href={`/ensaios/material/${userVoiceMaterialInEvent.id}`}
                  size="md"
                  radius="xl"
                  color="yellow.6"
                  fullWidth
                  leftSection={<IconPlayerPlay size={16} />}
                  style={{
                    backgroundColor: "#c9a227",
                    color: "#0c1e38",
                    fontWeight: 900,
                    height: "46px",
                  }}
                  className="w-full sm:w-auto shadow-sm hover:brightness-110 transition-all text-xs sm:text-sm"
                >
                  Treinar Minha Voz Agora
                </Button>
              ) : (
                <Button
                  component={Link}
                  href="#repertorio"
                  size="md"
                  radius="xl"
                  color="yellow.6"
                  fullWidth
                  style={{
                    backgroundColor: "#c9a227",
                    color: "#0c1e38",
                    fontWeight: 900,
                    height: "46px",
                  }}
                  className="w-full sm:w-auto shadow-sm text-xs sm:text-sm"
                >
                  Abrir Acervo de Obras
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BLOCO 2 (4 Colunas): PASSAPORTE VOCAL DO ALUNO & RANKING       */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 md:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div>
            {/* Topo do Passaporte */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0c1e38] text-white flex items-center justify-center font-bold text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {user.name || "Aluno Canarinhos"}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Cantor(a) Registrado(a)
                  </p>
                </div>
              </div>

              {/* Tag de Naipe */}
              <span
                className="px-2.5 py-1 rounded-md text-xs font-bold capitalize inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: "#edf4fb",
                  color: "#1e3a5f",
                  border: "1px solid #d8e7f6",
                }}
              >
                <IconMicrophone size={13} className="text-[#1e3a5f]" />
                <span>{voiceConfig.label}</span>
              </span>
            </div>

            {/* Estatísticas de Dedicação Vocal */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Nesta Semana
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {stats.weekSessions}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    ensaios
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Posição no Coro
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#c9a227] leading-none">
                    #{userRankData?.rank || 1}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    lugar
                  </span>
                </div>
              </div>
            </div>

            {/* Cartão de Reconhecimento */}
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">
                  {userRankData?.medal || "Dedicado"} • {userRankData?.totalMinutes || 0} min praticados
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                {stats.weekSessions >= 3
                  ? "Parabéns! Excelente ritmo de treino para os próximos cantos."
                  : "Mantenha o hábito de escutar seu naipe ao menos 10 minutos por dia."}
              </p>
            </div>
          </div>

          {/* Atalho de filtro da própria voz */}
          {user.voicePart && onQuickFilterVoice && (
            <button
              type="button"
              onClick={() => onQuickFilterVoice(user.voicePart!.toLowerCase())}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors border border-slate-200 min-h-[44px]"
            >
              <span className="flex items-center gap-1.5">
                <IconMicrophone size={15} className="text-[#1e3a5f]" />
                Meu Naipe: {user.voicePart} (Filtrar Repertório)
              </span>
              <IconArrowRight size={14} className="text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SEGUNDA LINHA BENTO: MURAL DA REGÊNCIA (MICRO-FEED LIMPO)      */}
      {/* ============================================================== */}
      {primaryAnnouncement && (
        <div className="mt-3.5 p-3.5 md:p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  Aviso da Regência
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {primaryAnnouncement.title}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                {primaryAnnouncement.content}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-slate-400 font-medium">
              {new Date(primaryAnnouncement.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </div>
      )}
    </Box>
  );
}
