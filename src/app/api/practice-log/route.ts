import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json().catch(() => ({}));
    const email = session?.user?.email || body.email;
    const materialId = body.materialId;

    if (!email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    if (!materialId) {
      return NextResponse.json(
        { error: "materialId é obrigatório" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const log = await prisma.practiceLog.create({
      data: {
        userId: user.id,
        materialId,
      },
    });

    return NextResponse.json({ ok: true, log });
  } catch (error) {
    console.error("Erro ao registrar ensaio:", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar ensaio" },
      { status: 500 }
    );
  }
}
