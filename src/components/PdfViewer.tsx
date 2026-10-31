"use client";

export function PdfViewer({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <p className="text-sm font-medium text-slate-900">{title}</p>
      </div>
      <div className="relative h-[600px] w-full">
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          loading="lazy"
        />
      </div>
      <div className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        Se o PDF não carregar,{" "}
        <a href={src} target="_blank" rel="noreferrer" className="underline hover:text-canarinhos-blue">
          abra em nova aba
        </a>.
      </div>
    </div>
  );
}