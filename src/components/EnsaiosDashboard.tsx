"use client";

import { useState } from "react";
import { Container, Tabs, Box } from "@mantine/core";
import {
  IconMicrophone,
  IconCalendarEvent,
  IconTrophy,
  IconUsersGroup,
} from "@tabler/icons-react";
import { BentoHeroCockpit } from "@/components/BentoHeroCockpit";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { MaterialsExplorer } from "@/components/MaterialsExplorer";
import { ChoirRanking, type RankingUser } from "@/components/ChoirRanking";
import { EventsManager, type EventItem } from "@/components/EventsManager";
import { StudentsManager, type StudentItem } from "@/components/StudentsManager";
import type { Announcement, Material, PracticeStats } from "@/components/types";

interface EnsaiosDashboardProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    voicePart?: string | null;
    role?: string;
  };
  stats: PracticeStats;
  materials: Material[];
  announcements: Announcement[];
  ranking: RankingUser[];
  events: EventItem[];
  students: StudentItem[];
  isAdmin?: boolean;
}

export function EnsaiosDashboard({
  user,
  stats,
  materials,
  announcements,
  ranking,
  events,
  students,
  isAdmin = false,
}: EnsaiosDashboardProps) {
  const [activeTab, setActiveTab] = useState<string | null>("repertorio");
  const [quickVoiceFilter, setQuickVoiceFilter] = useState<string | null>(null);

  const nextEvent = events[0];

  const handleQuickFilterVoice = (voice: string) => {
    setQuickVoiceFilter(voice);
    if (isAdmin) {
      setActiveTab("repertorio");
    }
  };

  return (
    <Box py="xl" className="bg-[#f8fafc] min-h-screen">
      <Container size="lg" className="px-3 sm:px-4 md:px-6">
        {/* ============================================================== */}
        {/* INSTALAÇÃO PWA MOBILE-FIRST                                    */}
        {/* ============================================================== */}
        <PwaInstallPrompt />

        {/* ============================================================== */}
        {/* 1. BENTO HERO COCKPIT: O CENTRO DE GRAVIDADE DA TELA           */}
        {/* ============================================================== */}
        <BentoHeroCockpit
          user={user}
          stats={stats}
          nextEvent={nextEvent}
          announcements={announcements}
          ranking={ranking}
          onQuickFilterVoice={handleQuickFilterVoice}
          isAdmin={isAdmin}
        />

        {/* ============================================================== */}
        {/* 2. VISÃO ALUNO vs REGENTE (CONTROLE DE ACESSO POR PERFIL)      */}
        {/* ============================================================== */}
        {!isAdmin ? (
          // VISÃO DO ALUNO: 100% focada no Repertório e estudo de voz
          <div className="space-y-4">
            <MaterialsExplorer
              initialMaterials={materials}
              currentUserVoice={user.voicePart}
              externalVoiceFilter={quickVoiceFilter}
            />
          </div>
        ) : (
          // VISÃO DO REGENTE / ADMIN: Console de Gestão e Acompanhamento
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            color="canarinhosBlue"
            radius="xl"
          >
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs mb-5 overflow-x-auto">
              <Tabs.List className="border-none flex-nowrap min-w-max gap-1">
                <Tabs.Tab
                  value="repertorio"
                  leftSection={<IconMicrophone size={15} />}
                  className="font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-all data-[active=true]:bg-[#0c1e38] data-[active=true]:text-white data-[active=true]:shadow-xs text-slate-700 hover:bg-slate-100"
                >
                  Repertório Geral ({materials.length > 0 ? "25 Obras" : "0"})
                </Tabs.Tab>

                <Tabs.Tab
                  value="eventos"
                  leftSection={<IconCalendarEvent size={15} />}
                  className="font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-all data-[active=true]:bg-[#0c1e38] data-[active=true]:text-white data-[active=true]:shadow-xs text-slate-700 hover:bg-slate-100"
                >
                  Agenda de Compromissos ({events.length})
                </Tabs.Tab>

                <Tabs.Tab
                  value="ranking"
                  leftSection={<IconTrophy size={15} />}
                  className="font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-all data-[active=true]:bg-[#0c1e38] data-[active=true]:text-white data-[active=true]:shadow-xs text-slate-700 hover:bg-slate-100"
                >
                  Ranking de Dedicação ({ranking.length})
                </Tabs.Tab>

                <Tabs.Tab
                  value="alunos"
                  leftSection={<IconUsersGroup size={15} />}
                  className="font-bold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-all data-[active=true]:bg-[#0c1e38] data-[active=true]:text-white data-[active=true]:shadow-xs text-slate-700 hover:bg-slate-100"
                >
                  Gestão de Alunos ({students.length})
                </Tabs.Tab>
              </Tabs.List>
            </div>

            {/* PAINEL 1: O GRANDE ACERVO DE REPERTÓRIO BENTO */}
            <Tabs.Panel value="repertorio">
              <MaterialsExplorer
                initialMaterials={materials}
                currentUserVoice={user.voicePart}
                externalVoiceFilter={quickVoiceFilter}
              />
            </Tabs.Panel>

            {/* PAINEL 2: AGENDA DE EVENTOS (CRIAR, EDITAR, APAGAR) */}
            <Tabs.Panel value="eventos">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <EventsManager initialEvents={events} allMaterials={materials} />
              </div>
            </Tabs.Panel>

            {/* PAINEL 3: RANKING DE DEDICAÇÃO VOCAL */}
            <Tabs.Panel value="ranking">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <ChoirRanking ranking={ranking} />
              </div>
            </Tabs.Panel>

            {/* PAINEL 4: CRUD / GESTÃO DE ALUNOS */}
            <Tabs.Panel value="alunos">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <StudentsManager initialStudents={students} />
              </div>
            </Tabs.Panel>
          </Tabs>
        )}
      </Container>
    </Box>
  );
}
