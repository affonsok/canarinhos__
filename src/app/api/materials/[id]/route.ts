import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: {
        group: true,
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(material);
  } catch (error) {
    console.error("Erro ao buscar material:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar material" },
      { status: 500 }
    );
  }
}
