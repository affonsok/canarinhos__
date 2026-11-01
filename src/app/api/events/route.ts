import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { authorized: false, status: 401, error: "Não autenticado" };
  }
  if (session.user.role !== "admin") {
    return { authorized: false, status: 403, error: "Acesso restrito ao regente administrador" };
  }
  return { authorized: true, user: session.user };
}

// GET: Lista eventos (Apenas Admin)
export async function GET() {
  try {
    const auth = await checkAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const events = await prisma.event.findMany({
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

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar eventos" },
      { status: 500 }
    );
  }
}

// POST: Cria novo evento (Apenas Admin)
export async function POST(request: Request) {
  try {
    const auth = await checkAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { title, description, eventDate, location, materialIds } = body;

    if (!title || !eventDate) {
      return NextResponse.json(
        { error: "Título e data do evento são obrigatórios" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        eventDate: new Date(eventDate),
        location: location ? location.trim() : null,
        materials: Array.isArray(materialIds) && materialIds.length > 0
          ? {
              connect: materialIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
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
    });

    return NextResponse.json({ ok: true, event });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar evento" },
      { status: 500 }
    );
  }
}

// PUT: Altera evento existente (Apenas Admin)
export async function PUT(request: Request) {
  try {
    const auth = await checkAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { id, title, description, eventDate, location, materialIds } = body;

    if (!id || !title || !eventDate) {
      return NextResponse.json(
        { error: "ID, título e data do evento são obrigatórios" },
        { status: 400 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        eventDate: new Date(eventDate),
        location: location ? location.trim() : null,
        materials: Array.isArray(materialIds)
          ? {
              set: materialIds.map((matId: string) => ({ id: matId })),
            }
          : undefined,
      },
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
    });

    return NextResponse.json({ ok: true, event: updatedEvent });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar evento" },
      { status: 500 }
    );
  }
}

// DELETE: Apaga evento existente (Apenas Admin)
export async function DELETE(request: Request) {
  try {
    const auth = await checkAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do evento é obrigatório" }, { status: 400 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (error) {
    console.error("Erro ao apagar evento:", error);
    return NextResponse.json(
      { error: "Erro interno ao apagar evento" },
      { status: 500 }
    );
  }
}
