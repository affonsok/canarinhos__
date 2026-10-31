import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Container, Box } from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendar,
  IconMicrophone,
  IconFileText,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PdfViewer } from "@/components/PdfViewer";
import type { Material } from "@/components/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VOICE_COLORS, formatVoiceButtonLabel } from "@/lib/repertoireMetadata";

export default async function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email && !session?.user?.name) redirect("/login");

  const dbMaterial = await prisma.material.findUnique({
    where: { id: params.id },
    include: {
      group: {
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
      },
    },
  });

  if (!dbMaterial) notFound();

  const material: Material = {
    id: dbMaterial.id,
    title: dbMaterial.title,
    type: dbMaterial.type as Material["type"],
    voicePart: dbMaterial.voicePart,
    driveId: dbMaterial.driveId,
    localPath: dbMaterial.localPath,
    uploadedAt: dbMaterial.uploadedAt.toISOString(),
    groupId: dbMaterial.groupId,
    group: dbMaterial.group
      ? {
          id: dbMaterial.group.id,
          name: dbMaterial.group.name,
          slug: dbMaterial.group.slug,
          description: dbMaterial.group.description,
        }
      : null,
  };

  const rawPath = material.localPath || material.driveId || "";
  const mediaSrc =
    rawPath && !rawPath.startsWith("http") && !rawPath.startsWith("/")
      ? `/${rawPath}`
      : rawPath;

  const isAudio = material.type === "audio";

  // Identifica partituras e outros naipes da mesma obra
  const siblingMaterials = dbMaterial.group?.materials || [];
  const scoreSibling = siblingMaterials.find((m) => m.type === "score");
  const audioSiblings = siblingMaterials.filter(
    (m) => m.type === "audio" && m.id !== material.id
  );

  return (
    <Box py="lg" className="bg-[#f8fafc] min-h-screen">
      <Container size="lg" className="px-3 sm:px-4 md:px-6">
        {/* ============================================================== */}
        {/* NAVEGAÇÃO DE RETORNO BENTO                                     */}
        {/* ============================================================== */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/ensaios"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>Voltar ao Acervo de Ensaios</span>
          </Link>

          {dbMaterial.group && (
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Obra: <strong className="text-slate-900">{dbMaterial.group.name}</strong>
            </span>
          )}
        </div>

        {/* ============================================================== */}
        {/* CABEÇALHO BENTO DA OBRA                                        */}
        {/* ============================================================== */}
        <div className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  isAudio
                    ? "bg-blue-50 text-blue-800 border border-blue-200/60"
                    : "bg-amber-50 text-amber-900 border border-amber-200/60"
                }`}
              >
                {isAudio ? (
                  <IconMicrophone size={13} />
                ) : (
                  <IconFileText size={13} />
                )}
                <span>{isAudio ? "Áudio de Ensaio Vocal" : "Partitura Geral (PDF)"}</span>
              </span>

              {material.voicePart && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0c1e38] text-white capitalize">
                  Naipe: {material.voicePart}
                </span>
              )}

              {dbMaterial.group && (
                <span className="text-xs font-medium text-slate-500">
                  {dbMaterial.group.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <IconCalendar size={13} />
              <span>
                {new Date(material.uploadedAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {material.title}
          </h1>

          {/* Atalhos Rápidos da Mesma Obra (Troca de Naipe / Partitura) */}
          {(scoreSibling && isAudio) || audioSiblings.length > 0 ? (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Acesso Rápido na mesma obra:
              </span>

              {scoreSibling && isAudio && (
                <Link
                  href={`/ensaios/material/${scoreSibling.id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors"
                >
                  <IconFileText size={13} />
                  <span>Ver Partitura Oficial</span>
                </Link>
              )}

              {audioSiblings.map((sib) => {
                const label = formatVoiceButtonLabel(sib as Material);
                return (
                  <Link
                    key={sib.id}
                    href={`/ensaios/material/${sib.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                  >
                    <IconPlayerPlay size={11} className="text-[#1e3a5f]" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* ============================================================== */}
        {/* PLAYER DE ÁUDIO OU VISUALIZADOR DE PARTITURA                   */}
        {/* ============================================================== */}
        <div className="mb-4">
          {!mediaSrc ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200/90 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Arquivo de mídia não encontrado para este registro.
              </p>
            </div>
          ) : isAudio ? (
            <AudioPlayer
              src={mediaSrc}
              title={material.title}
              materialId={material.id}
            />
          ) : (
            <PdfViewer src={mediaSrc} title={material.title} />
          )}
        </div>

        {/* ============================================================== */}
        {/* DICAS DE ENSAIO VOCAL EM FORMATO BENTO                         */}
        {/* ============================================================== */}
        {isAudio && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1e3a5f] flex items-center justify-center font-bold text-xs mb-2">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                Uso de Fones de Ouvido
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Utilize fones estéreo para perceber com clareza a afinação, o timbre e a entrada exata da sua linha melódica.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mb-2">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                Velocidade 0.75x para Trechos Rápidos
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Em passagens com muitas semicolcheias ou texto em latim/espanhol, diminua a velocidade para memorizar a dicção.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                Repetição em Loop
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ative o botão de repetição para cantar junto repetidas vezes até que a afinação e respiração fiquem automáticas.
              </p>
            </div>
          </div>
        )}
      </Container>
    </Box>
  );
}
