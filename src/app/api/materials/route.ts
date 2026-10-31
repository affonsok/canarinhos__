import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const group = searchParams.get("group");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (type) {
      where.type = type;
    }

    if (group) {
      where.group = {
        slug: group,
      };
    }

    if (search) {
      where.title = {
        contains: search,
      };
    }

    const materials = await prisma.material.findMany({
      where,
      include: {
        group: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error("Erro ao buscar materiais:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar materiais" },
      { status: 500 }
    );
  }
}
