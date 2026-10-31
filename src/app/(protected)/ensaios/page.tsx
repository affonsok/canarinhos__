import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { EnsaiosDashboard } from "@/components/EnsaiosDashboard";
import type { Announcement, Material, PracticeStats } from "@/components/types";
import type { RankingUser } from "@/components/ChoirRanking";
import type { EventItem } from "@/components/EventsManager";
import type { StudentItem } from "@/components/StudentsManager";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EnsaiosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email && !session?.user?.name) {
    redirect("/login");
  }

  // 1. Carrega materiais com seus grupos/músicas
  const dbMaterials = await prisma.material.findMany({
    include: { group: true },
    orderBy: { uploadedAt: "desc" },
  });
  const materials: Material[] = dbMaterials.map((m) => ({
    id: m.id,
    title: m.title,
    type: m.type as Material["type"],
    voicePart: m.voicePart,
    driveId: m.driveId,
    localPath: m.localPath,
    uploadedAt: m.uploadedAt.toISOString(),
    groupId: m.groupId,
    group: m.group
      ? {
          id: m.group.id,
          name: m.group.name,
          slug: m.group.slug,
          description: m.group.description,
        }
      : null,
  }));

  // 2. Carrega avisos
  const dbAnnouncements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  const announcements: Announcement[] = dbAnnouncements.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    eventDate: a.eventDate ? a.eventDate.toISOString() : null,
    location: a.location,
    createdAt: a.createdAt.toISOString(),
  }));

  // 3. Identifica usuário atual por email ou username
  const userIdentifier = session.user.email || session.user.name;
  const currentUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: userIdentifier || "" },
        { username: userIdentifier || "" },
      ],
    },
  });

  let stats: PracticeStats = {
    totalSessions: 0,
    weekSessions: 0,
    lastPracticeAt: null,
  };

  if (currentUser) {
    const totalSessions = await prisma.practiceLog.count({
      where: { userId: currentUser.id },
    });
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSessions = await prisma.practiceLog.count({
      where: {
        userId: currentUser.id,
        timestamp: { gte: weekAgo },
      },
    });
    const lastLog = await prisma.practiceLog.findFirst({
      where: { userId: currentUser.id },
      orderBy: { timestamp: "desc" },
    });
    stats = {
      totalSessions,
      weekSessions,
      lastPracticeAt: lastLog?.timestamp?.toISOString() || null,
    };
  }

  // 4. Carrega ranking dos cantores
  const allUsers = await prisma.user.findMany({
    include: {
      practiceLogs: true,
    },
  });

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const ranking: RankingUser[] = allUsers
    .map((u) => {
      const totalSessions = u.practiceLogs.length;
      const weekSessions = u.practiceLogs.filter(
        (log) => new Date(log.timestamp) >= oneWeekAgo
      ).length;
      const totalMinutes = Math.round(
        u.practiceLogs.reduce((acc, log) => acc + (log.duration || 120), 0) / 60
      );
      const lastLog = u.practiceLogs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

      return {
        id: u.id,
        name: u.name,
        voicePart: u.voicePart || "Tutti",
        totalSessions,
        weekSessions,
        totalMinutes,
        lastPracticeAt: lastLog ? lastLog.timestamp.toISOString() : null,
        rank: 0,
        medal: "",
      };
    })
    .sort((a, b) => {
      if (b.weekSessions !== a.weekSessions) {
        return b.weekSessions - a.weekSessions;
      }
      return b.totalSessions - a.totalSessions;
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      medal:
        index === 0
          ? "🥇 Ouro"
          : index === 1
            ? "🥈 Prata"
            : index === 2
              ? "🥉 Bronze"
              : "⭐ Participante",
    }));

  // 5. Carrega eventos com repertório conectado
  const dbEvents = await prisma.event.findMany({
    include: {
      materials: {
        select: {
          id: true,
          title: true,
          type: true,
          voicePart: true,
        },
      },
    },
    orderBy: {
      eventDate: "asc",
    },
  });

  const events: EventItem[] = dbEvents.map((evt) => ({
    id: evt.id,
    title: evt.title,
    description: evt.description,
    eventDate: evt.eventDate.toISOString(),
    location: evt.location,
    materials: evt.materials,
  }));

  // 6. Carrega alunos cadastrados para o CRUD
  const allStudents = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      voicePart: true,
      role: true,
      createdAt: true,
      _count: {
        select: { practiceLogs: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const students: StudentItem[] = allStudents.map((s) => ({
    id: s.id,
    name: s.name,
    username: s.username || s.email?.split("@")[0] || "aluno",
    email: s.email,
    voicePart: s.voicePart || "Tutti",
    role: s.role,
    createdAt: s.createdAt.toISOString(),
    totalSessions: s._count.practiceLogs,
  }));

  return (
    <EnsaiosDashboard
      user={{
        name: currentUser?.name || session.user.name,
        email: currentUser?.username || session.user.email,
      }}
      stats={stats}
      materials={materials}
      announcements={announcements}
      ranking={ranking}
      events={events}
      students={students}
    />
  );
}
