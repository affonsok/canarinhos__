"use client";

import {
  Table,
  Badge,
  ThemeIcon,
  Group,
  Text,
  RingProgress,
  Box,
} from "@mantine/core";
import {
  IconTrophy,
  IconFlame,
  IconClock,
  IconUser,
  IconMedal,
} from "@tabler/icons-react";

export interface RankingUser {
  id: string;
  name: string;
  voicePart: string;
  totalSessions: number;
  weekSessions: number;
  totalMinutes: number;
  lastPracticeAt: string | null;
  rank: number;
  medal: string;
}

const voiceColors: Record<string, string> = {
  soprano: "pink",
  contralto: "grape",
  tenor: "cyan",
  baixo: "indigo",
  baritono: "teal",
  todos: "green",
};

export function ChoirRanking({ ranking }: { ranking: RankingUser[] }) {
  const topThree = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Ranking */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-[#a98418]">
              <IconTrophy size={18} />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Ranking de Dedicação Vocal dos Canarinhos
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pontuação baseada na constância semanal de treinos e minutos de escuta das gravações de naipe.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 self-start sm:self-auto">
          {ranking.length} cantores ativos
        </span>
      </div>

      {/* Pódio Bento dos 3 Primeiros */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topThree.map((user, idx) => {
            const isFirst = idx === 0;
            const rankLabel = idx === 0 ? "1º Lugar" : idx === 1 ? "2º Lugar" : "3º Lugar";
            const medalEmoji = idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉";

            return (
              <div
                key={user.id}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isFirst
                    ? "bg-amber-50/40 border-[#c9a227] shadow-xs"
                    : "bg-white border-slate-200/90 shadow-2xs"
                }`}
              >
                {isFirst && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#c9a227]" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-white border border-slate-200 shadow-2xs text-slate-900">
                      <span>{medalEmoji}</span>
                      <span>{rankLabel}</span>
                    </span>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded capitalize bg-slate-100 text-slate-700">
                      {user.voicePart}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-tight truncate">
                    {user.name}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Esta Semana
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {user.weekSessions}x
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Tempo Total
                    </span>
                    <span className="text-lg font-black text-[#c9a227]">
                      {user.totalMinutes} min
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabela do Restante do Coro */}
      {rest.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white">
          <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Demais Cantores Participantes
          </div>

          <div className="divide-y divide-slate-100">
            {rest.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-bold text-slate-400">
                    #{user.rank}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user.name}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                      Naipe: {user.voicePart}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-600 font-semibold">
                    {user.weekSessions} sessões/sem
                  </span>
                  <span className="font-bold text-slate-900">
                    {user.totalMinutes} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
