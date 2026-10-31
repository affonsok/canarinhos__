import Link from "next/link";
import type { Material } from "./types";

const typeLabels: Record<Material["type"], string> = {
  audio: "Áudio",
  lyric: "Letra",
  score: "Partitura",
};

const typeColors: Record<Material["type"], string> = {
  audio: "bg-blue-100 text-canarinhos-blue",
  lyric: "bg-yellow-100 text-yellow-800",
  score: "bg-slate-100 text-slate-700",
};

export function MaterialCard({ material }: { material: Material }) {
  return (
    <Link
      href={`/ensaios/material/${material.id}`}
      className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-canarinhos-gold hover:shadow-md"
    >
      <div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[material.type]}`}
        >
          {typeLabels[material.type]}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-canarinhos-blue">
          {material.title}
        </h3>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Adicionado em {new Date(material.uploadedAt).toLocaleDateString("pt-BR")}
      </p>
    </Link>
  );
}