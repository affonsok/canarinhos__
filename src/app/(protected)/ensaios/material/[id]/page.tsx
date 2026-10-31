import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PdfViewer } from "@/components/PdfViewer";
import type { Material } from "@/components/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function fetchMaterial(id: string): Promise<Material | null> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${baseUrl}/api/materials/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Material;
  } catch {
    return null;
  }
}

export default async function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  let material = await fetchMaterial(params.id);

  // Fallback caso a chamada interna à API falhe
  if (!material) {
    const dbMaterial = await prisma.material.findUnique({
      where: { id: params.id },
      include: { group: true },
    });

    if (dbMaterial) {
      material = {
        id: dbMaterial.id,
        title: dbMaterial.title,
        type: dbMaterial.type as Material["type"],
        driveId: dbMaterial.driveId,
        localPath: dbMaterial.localPath,
        uploadedAt: dbMaterial.uploadedAt.toISOString(),
      };
    }
  }

  if (!material) notFound();

  const rawPath = material.localPath || material.driveId || "";
  const mediaSrc =
    rawPath && !rawPath.startsWith("http") && !rawPath.startsWith("/")
      ? `/${rawPath}`
      : rawPath;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6">
        <Link
          href="/ensaios"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-canarinhos-blue"
        >
          <span>←</span> Voltar para a Área de Ensaios
        </Link>
      </nav>

      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-canarinhos-gold">
          {material.type === "audio"
            ? "Áudio para Ensaio"
            : material.type === "lyric"
              ? "Letra da Música"
              : "Partitura"}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-canarinhos-blue">
          {material.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Adicionado em{" "}
          {new Date(material.uploadedAt).toLocaleDateString("pt-BR")}
        </p>
      </header>

      {!mediaSrc ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Arquivo indisponível no momento.
        </div>
      ) : material.type === "audio" ? (
        <AudioPlayer src={mediaSrc} title={material.title} materialId={material.id} />
      ) : (
        <PdfViewer src={mediaSrc} title={material.title} />
      )}
    </div>
  );
}
