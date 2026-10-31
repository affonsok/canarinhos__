import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email não fornecido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        totalSessions: 0,
        weekSessions: 0,
        lastPracticeAt: null,
      });
    }

    const totalSessions = await prisma.practiceLog.count({
      where: { userId: user.id },
    });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const weekSessions = await prisma.practiceLog.count({
      where: {
        userId: user.id,
        timestamp: {
          gte: startOfWeek,
        },
      },
    });

    const lastLog = await prisma.practiceLog.findFirst({
      where: { userId: user.id },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({
      totalSessions,
      weekSessions,
      lastPracticeAt: lastLog?.timestamp?.toISOString() || null,
    });
  } catch (error) {
    console.error("Erro ao calcular estatísticas de ensaio:", error);
    return NextResponse.json(
      { error: "Erro interno ao calcular estatísticas" },
      { status: 500 }
    );
  }
}
