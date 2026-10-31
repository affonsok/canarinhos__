"use client";

import { IconFileText, IconExternalLink, IconDownload, IconPrinter } from "@tabler/icons-react";

export function PdfViewer({ src, title }: { src: string; title: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
      {/* Barra Superior do Visualizador Bento */}
      <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <IconFileText size={17} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
              Partitura: {title}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Documento musical oficial para impressão ou visualização
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#edf4fb] hover:bg-[#d8e7f6] text-[#1e3a5f] border border-[#accdef] transition-colors"
          >
            <IconExternalLink size={13} />
            <span>Tela Cheia</span>
          </a>

          <a
            href={src}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#c9a227] hover:bg-[#b58f1f] text-slate-950 transition-colors shadow-2xs"
          >
            <IconDownload size={13} />
            <span>Baixar PDF</span>
          </a>
        </div>
      </div>

      {/* Frame de Exibição de Partitura */}
      <div className="relative h-[650px] sm:h-[750px] w-full bg-slate-100">
        <iframe
          src={src}
          title={title}
          className="w-full h-full border-none"
          loading="lazy"
        />
      </div>
    </div>
  );
}
