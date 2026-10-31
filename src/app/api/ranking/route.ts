import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        practiceLogs: true,
      },
    });

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const ranking = users
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
          email: u.email,
          voicePart: u.voicePart || "Tutti",
          totalSessions,
          weekSessions,
          totalMinutes,
          lastPracticeAt: lastLog ? lastLog.timestamp.toISOString() : null,
        };
      })
      .sort((a, b) => {
        // Ordena por ensaios na semana, depois total
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

    return NextResponse.json(ranking);
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return NextResponse.json(
      { error: "Erro interno ao calcular ranking" },
      { status: 500 }
    );
  }
}
