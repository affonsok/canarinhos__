import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

export async function POST(request: Request) {
  try {
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
        title,
        description: description || null,
        eventDate: new Date(eventDate),
        location: location || null,
        materials: Array.isArray(materialIds) && materialIds.length > 0
          ? {
              connect: materialIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        materials: true,
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
