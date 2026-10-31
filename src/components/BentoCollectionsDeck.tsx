"use client";

interface BentoCollectionsDeckProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  counts: {
    all: number;
    natal: number;
    missas: number;
    classicos: number;
    mpb: number;
  };
}

export function BentoCollectionsDeck({
  selectedCategory,
  onSelectCategory,
  counts,
}: BentoCollectionsDeckProps) {
  const cards = [
    {
      id: "all",
      label: "Todas as Obras",
      count: counts.all,
      subtitle: "Acervo Completo",
      borderActive: "border-[#1e3a5f]",
      bgActive: "bg-[#edf4fb]",
    },
    {
      id: "natal",
      label: "Natal 2026",
      count: counts.natal,
      subtitle: "Especial de Fim de Ano",
      borderActive: "border-red-600",
      bgActive: "bg-red-50",
    },
    {
      id: "missas",
      label: "Missas & Liturgia",
      count: counts.missas,
      subtitle: "Simplex, Maio, Agosto, Set.",
      borderActive: "border-blue-700",
      bgActive: "bg-blue-50",
    },
    {
      id: "classicos",
      label: "Clássico & Sacro",
      count: counts.classicos,
      subtitle: "Mozart, Aguiar, Rutter",
      borderActive: "border-purple-700",
      bgActive: "bg-purple-50",
    },
    {
      id: "mpb",
      label: "MPB & Coral",
      count: counts.mpb,
      subtitle: "Barbatuques, Pixinguinha",
      borderActive: "border-teal-700",
      bgActive: "bg-teal-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 mb-3.5">
      {cards.map((card, idx) => {
        const isSelected = selectedCategory === card.id;
        const isFirst = idx === 0;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCategory(card.id)}
            className={`flex flex-col justify-between text-left p-3 rounded-xl border transition-all relative overflow-hidden group min-h-[72px] active:scale-98 ${
              isFirst ? "col-span-2 sm:col-span-1" : ""
            } ${
              isSelected
                ? `${card.bgActive} ${card.borderActive} shadow-xs font-bold ring-1 ring-inset ring-black/5`
                : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70"
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5 w-full">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isSelected ? "text-[#1e3a5f]" : "text-slate-400"
                }`}
              >
                Coleção
              </span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  isSelected
                    ? "bg-white text-slate-900 font-extrabold shadow-2xs border border-slate-200/80"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                }`}
              >
                {card.count} {card.count === 1 ? "obra" : "obras"}
              </span>
            </div>

            <div>
              <span
                className={`text-xs font-bold leading-snug truncate block ${
                  isSelected ? "text-slate-950 font-black" : "text-slate-800"
                }`}
              >
                {card.label}
              </span>

              <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
                {card.subtitle}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
