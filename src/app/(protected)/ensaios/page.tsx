import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { MaterialCard } from "@/components/MaterialCard";
import type { Announcement, Material, PracticeStats } from "@/components/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function fetchApi<T>(path: string): Promise<T | null> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface EnsaiosPageProps {
  searchParams?: {
    type?: string;
  };
}

export default async function EnsaiosPage({ searchParams }: EnsaiosPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const currentType = searchParams?.type;
  const typeQuery = currentType ? `?type=${encodeURIComponent(currentType)}` : "";

  // Busca dados em paralelo via API interna com fallback direto ao Prisma
  let [materials, announcements, stats] = await Promise.all([
    fetchApi<Material[]>(`/api/materials${typeQuery}`),
    fetchApi<Announcement[]>("/api/announcements"),
    fetchApi<PracticeStats>(
      `/api/practice-stats?email=${encodeURIComponent(session.user.email)}`
    ),
  ]);

  // Fallback resiliente caso a chamada HTTP interna falhe
  if (!materials) {
    const dbMaterials = await prisma.material.findMany({
      where: currentType ? { type: currentType } : undefined,
      orderBy: { uploadedAt: "desc" },
    });
    materials = dbMaterials.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type as Material["type"],
      driveId: m.driveId,
      localPath: m.localPath,
      uploadedAt: m.uploadedAt.toISOString(),
    }));
  }

  if (!announcements) {
    const dbAnnouncements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    announcements = dbAnnouncements.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      eventDate: a.eventDate ? a.eventDate.toISOString() : null,
      location: a.location,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  if (!stats) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      const totalSessions = await prisma.practiceLog.count({
        where: { userId: user.id },
      });
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekSessions = await prisma.practiceLog.count({
        where: {
          userId: user.id,
          timestamp: { gte: weekAgo },
        },
      });
      const lastLog = await prisma.practiceLog.findFirst({
        where: { userId: user.id },
        orderBy: { timestamp: "desc" },
      });
      stats = {
        totalSessions,
        weekSessions,
        lastPracticeAt: lastLog?.timestamp?.toISOString() || null,
      };
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-canarinhos-blue">Área de Ensaios</h1>
          <p className="mt-1 text-slate-600">
            Bem-vindo(a), <span className="font-semibold">{session.user.name || session.user.email}</span>.
          </p>
        </div>
        {stats && (
          <div className="rounded-lg border border-canarinhos-gold/40 bg-canarinhos-gold/10 px-4 py-2 text-sm text-canarinhos-blue">
            Você ensaiou <strong>{stats.weekSessions}</strong> vez(es) esta semana · Total:{" "}
            <strong>{stats.totalSessions}</strong>
          </div>
        )}
      </header>

      {/* Avisos */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Avisos Recentes</h2>
        {!announcements || announcements.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Nenhum aviso no momento. Fique atento aos comunicados da regência!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((a) => (
              <AnnouncementCard key={a.id} announcement={a} />
            ))}
          </div>
        )}
      </section>

      {/* Materiais com filtros via query string */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">
            Materiais de Estudo ({materials?.length ?? 0})
          </h2>
          <nav className="flex gap-2 text-sm">
            {[
              { label: "Todos", href: "/ensaios", active: !currentType },
              { label: "Áudio", href: "/ensaios?type=audio", active: currentType === "audio" },
              { label: "Letra", href: "/ensaios?type=lyric", active: currentType === "lyric" },
              { label: "Partitura", href: "/ensaios?type=score", active: currentType === "score" },
            ].map((f) => (
              <Link
                key={f.label}
                href={f.href}
                className={`rounded-full border px-3 py-1 font-medium transition ${
                  f.active
                    ? "border-canarinhos-blue bg-canarinhos-blue text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-canarinhos-blue hover:text-canarinhos-blue"
                }`}
              >
                {f.label}
              </Link>
            ))}
          </nav>
        </div>

        {!materials || materials.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            Nenhum material encontrado para este filtro.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m) => (
              <MaterialCard key={m.id} material={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
