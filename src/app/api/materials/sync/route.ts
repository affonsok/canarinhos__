import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.SYNC_SECRET || "canarinhos-sync-secret";

    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      driveId,
      fileName,
      originalName,
      mimeType,
      localPath,
      groupSlug,
      voicePart,
      type,
    } = body;

    if (!driveId || !localPath || !groupSlug || !type) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: driveId, localPath, groupSlug, type" },
        { status: 400 }
      );
    }

    // Garante que o grupo existe
    let group = await prisma.materialGroup.findUnique({
      where: { slug: groupSlug },
    });

    if (!group) {
      group = await prisma.materialGroup.create({
        data: {
          slug: groupSlug,
          name: toTitle(groupSlug),
        },
      });
    }

    const title = (originalName || fileName || "Material")
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ");

    // Upsert pelo driveId se existir, ou cria novo
    const existing = await prisma.material.findFirst({
      where: { driveId },
    });

    let material;
    if (existing) {
      material = await prisma.material.update({
        where: { id: existing.id },
        data: {
          title,
          fileName,
          mimeType,
          localPath,
          groupId: group.id,
          voicePart: voicePart || null,
          type,
        },
      });
    } else {
      material = await prisma.material.create({
        data: {
          title,
          fileName,
          mimeType,
          localPath,
          groupId: group.id,
          voicePart: voicePart || null,
          type,
          driveId,
        },
      });
    }

    return NextResponse.json({ ok: true, material });
  } catch (error) {
    console.error("Erro na sincronização de material:", error);
    return NextResponse.json(
      { error: "Erro interno no processamento do material" },
      { status: 500 }
    );
  }
}
