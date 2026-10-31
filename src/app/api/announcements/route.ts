import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Erro ao buscar avisos:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar avisos" },
      { status: 500 }
    );
  }
}
