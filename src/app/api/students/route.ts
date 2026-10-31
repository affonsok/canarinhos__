import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// GET: Lista todos os alunos/usuários
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        voicePart: true,
        role: true,
        createdAt: true,
        _count: {
          select: { practiceLogs: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formatted = students.map((s) => ({
      id: s.id,
      name: s.name,
      username: s.username || s.email?.split("@")[0] || "aluno",
      email: s.email,
      voicePart: s.voicePart || "Tutti",
      role: s.role,
      createdAt: s.createdAt.toISOString(),
      totalSessions: s._count.practiceLogs,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar alunos" },
      { status: 500 }
    );
  }
}

// POST: Cadastra novo aluno
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, username, password, voicePart, role } = body;

    if (!name || !password) {
      return NextResponse.json(
        { error: "Nome e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanUsername = username
      ? sanitizeUsername(username)
      : sanitizeUsername(name);

    if (!cleanUsername) {
      return NextResponse.json(
        { error: "Login de aluno inválido" },
        { status: 400 }
      );
    }

    // Verifica se login já existe
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: `${cleanUsername}@canarinhos.local` },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `O login '${cleanUsername}' já está em uso por outro aluno.` },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newStudent = await prisma.user.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: `${cleanUsername}@canarinhos.local`,
        passwordHash,
        voicePart: voicePart || "soprano",
        role: role || "member",
      },
    });

    return NextResponse.json({
      ok: true,
      student: {
        id: newStudent.id,
        name: newStudent.name,
        username: newStudent.username,
        email: newStudent.email,
        voicePart: newStudent.voicePart,
        role: newStudent.role,
        createdAt: newStudent.createdAt.toISOString(),
        totalSessions: 0,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar aluno" },
      { status: 500 }
    );
  }
}

// PUT: Atualiza aluno existente
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, username, password, voicePart, role } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID e Nome são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanUsername = username ? sanitizeUsername(username) : undefined;

    if (cleanUsername) {
      const existing = await prisma.user.findFirst({
        where: {
          username: cleanUsername,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: `O login '${cleanUsername}' já pertence a outro aluno.` },
          { status: 409 }
        );
      }
    }

    const dataToUpdate: Record<string, unknown> = {
      name: name.trim(),
      voicePart: voicePart || "soprano",
      role: role || "member",
    };

    if (cleanUsername) {
      dataToUpdate.username = cleanUsername;
    }

    if (password && password.trim().length > 0) {
      dataToUpdate.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      ok: true,
      student: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        voicePart: updated.voicePart,
        role: updated.role,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar aluno" },
      { status: 500 }
    );
  }
}

// DELETE: Remove aluno
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir aluno" },
      { status: 500 }
    );
  }
}
