import type { Material } from "@/components/types";

export interface RepertoireWork {
  id: string; // group id or slug
  name: string; // clean title
  subtitle?: string; // composer, liturgical moment, arrangement
  category: "natal" | "missas" | "classicos" | "mpb";
  categoryLabel: string;
  categoryColor: string;
  categoryIcon: string;
  subCategory?: string; // e.g. "Missa de Agosto", "Missa de Maio"
  scores: Material[];
  audios: Material[];
  allMaterials: Material[];
  availableVoices: string[];
}

// Mapeamento enriquecido das 25 obras conhecidas do repertório dos Canarinhos
interface WorkMeta {
  cleanTitle: string;
  subtitle: string;
  category: "natal" | "missas" | "classicos" | "mpb";
  subCategory?: string;
}

const KNOWN_WORKS: Record<string, WorkMeta> = {
  // Sacro & Clássicos
  "ave-verum-corpus-mozart": {
    cleanTitle: "Ave Verum Corpus",
    subtitle: "W. A. Mozart • KV 618",
    category: "classicos",
  },
  "salmo-150-ernani-aguiar": {
    cleanTitle: "Salmo 150 (Laudate Dominum)",
    subtitle: "Ernani Aguiar • Moteto Sacro",
    category: "classicos",
  },
  "the-lord-bless-you-and-keep-you": {
    cleanTitle: "The Lord Bless You and Keep You",
    subtitle: "John Rutter • Bênção Coral",
    category: "classicos",
  },

  // Natal 2026
  "natal-2026-christmas-time-is-here": {
    cleanTitle: "Christmas Time Is Here",
    subtitle: "Vince Guaraldi • Especial de Natal 2026",
    category: "natal",
  },
  "natal-2026-gloria": {
    cleanTitle: "Glória (Gloria in Excelsis Deo)",
    subtitle: "Tradicional Francês de Natal",
    category: "natal",
  },
  "natal-2026-jingle-bell-rock": {
    cleanTitle: "Jingle Bell Rock",
    subtitle: "Joe Beal & Jim Boothe • Coral Canarinhos",
    category: "natal",
  },
  "natal-2026-los-reyes-magos": {
    cleanTitle: "Los Reyes Magos",
    subtitle: "Ariel Ramírez • Navidad Nuestra",
    category: "natal",
  },

  // Missas: Missa de Agosto
  "missa-agosto-missa-simplex-kyrie": {
    cleanTitle: "Kyrie Eleison (Senhor, Tende Piedade)",
    subtitle: "Theo de Petrus • Missa Simplex",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-aclamacao-do-evangelho-aleluia": {
    cleanTitle: "Aclamação ao Evangelho (Aleluia)",
    subtitle: "Manuel Simões • Missa de Agosto",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-maos-abertas": {
    cleanTitle: "Mãos Abertas (Ofertório)",
    subtitle: "Canto de Oferendas • Missa de Agosto",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-missa-simplex-sanctus": {
    cleanTitle: "Sanctus (Santo)",
    subtitle: "Theo de Petrus • Missa Simplex",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-pater-noster": {
    cleanTitle: "Pater Noster (Pai Nosso Gregoriano)",
    subtitle: "Canto Gregoriano Tradicional",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-missa-simplex-agnus-dei": {
    cleanTitle: "Agnus Dei (Cordeiro de Deus)",
    subtitle: "Theo de Petrus • Missa Simplex",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-panis-angelicus": {
    cleanTitle: "Panis Angelicus (Comunhão)",
    subtitle: "Claudio Casciolini • Missa de Agosto",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-alma-de-cristo": {
    cleanTitle: "Alma de Cristo (Anima Christi)",
    subtitle: "Marco Frisina • Pós-Comunhão",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-canto-de-entrada-hino-sao-pio-x": {
    cleanTitle: "Canto de Entrada (Hino a São Pio X)",
    subtitle: "Canto de Entrada Solene",
    category: "missas",
    subCategory: "Missa de Agosto",
  },
  "missa-agosto-canto-de-saida-the-lord-bless-you-and-keep-you": {
    cleanTitle: "Canto de Saída (The Lord Bless You and Keep You)",
    subtitle: "John Rutter • Saída",
    category: "missas",
    subCategory: "Missa de Agosto",
  },

  // Missas: Missa de Maio
  "missa-maio-ave-maria": {
    cleanTitle: "Ave Maria",
    subtitle: "J. S. Bach / Charles Gounod • Missa de Maio",
    category: "missas",
    subCategory: "Missa de Maio",
  },
  "missa-maio-maos-abertas": {
    cleanTitle: "Mãos Abertas (Ofertório)",
    subtitle: "Canto de Oferendas • Missa de Maio",
    category: "missas",
    subCategory: "Missa de Maio",
  },
  "missa-maio-panis-angelicus": {
    cleanTitle: "Panis Angelicus",
    subtitle: "Claudio Casciolini • Missa de Maio",
    category: "missas",
    subCategory: "Missa de Maio",
  },

  // Missas: Missa de Setembro
  "missa-setembro-hino-de-sao-vicente-de-paulo": {
    cleanTitle: "Hino de São Vicente de Paulo",
    subtitle: "Missa Festiva de Setembro",
    category: "missas",
    subCategory: "Missa de Setembro",
  },

  // MPB, Trilha Sonora & Coral Geral
  "baiana": {
    cleanTitle: "Baiana",
    subtitle: "Barbatuques • Percussão Vocal & Coral",
    category: "mpb",
  },
  "carinhoso": {
    cleanTitle: "Carinhoso",
    subtitle: "Pixinguinha e João de Barro • Arranjo Coral",
    category: "mpb",
  },
  "vilarejo": {
    cleanTitle: "Vilarejo",
    subtitle: "Marisa Monte • Arranjo a 3 Vozes",
    category: "mpb",
  },
  "vois-sur-ton-chemin": {
    cleanTitle: "Vois Sur Ton Chemin",
    subtitle: "Bruno Coulais • Filme 'Les Choristes'",
    category: "mpb",
  },
};

export const CATEGORY_INFO = {
  all: {
    label: "Todas as Obras",
    color: "canarinhosBlue",
    icon: "",
  },
  natal: {
    label: "Natal 2026",
    color: "red",
    icon: "",
  },
  missas: {
    label: "Missas & Liturgia",
    color: "blue",
    icon: "",
  },
  classicos: {
    label: "Clássico & Sacro",
    color: "violet",
    icon: "",
  },
  mpb: {
    label: "MPB & Coral Geral",
    color: "teal",
    icon: "",
  },
} as const;

export const VOICE_ORDER: Record<string, number> = {
  soprano: 1,
  contralto: 2,
  tenor: 3,
  baixo: 4,
  baritono: 5,
  solo: 6,
  todos: 7,
  tutti: 7,
  guia: 8,
};

export const VOICE_COLORS: Record<string, { color: string; label: string; badge: string }> = {
  soprano: { color: "pink", label: "Soprano", badge: "" },
  contralto: { color: "grape", label: "Contralto", badge: "" },
  tenor: { color: "cyan", label: "Tenor", badge: "" },
  baixo: { color: "indigo", label: "Baixo", badge: "" },
  baritono: { color: "teal", label: "Barítono", badge: "" },
  solo: { color: "orange", label: "Solo", badge: "" },
  todos: { color: "green", label: "Tutti / Todos", badge: "" },
  tutti: { color: "green", label: "Tutti / Todos", badge: "" },
  guia: { color: "yellow", label: "Áudio Guia", badge: "" },
};

/**
 * Limpa o título do áudio para exibição no botão do naipe
 */
export function formatVoiceButtonLabel(material: Material): string {
  const title = material.title.trim();
  const lower = title.toLowerCase();

  if (lower === "baixo") return "Baixo";
  if (lower === "contralto") return "Contralto";
  if (lower === "soprano") return "Soprano";
  if (lower === "tenor") return "Tenor";
  if (lower === "baritono" || lower === "baritonos") return "Barítono";
  if (lower === "todos") return "Todos (Tutti)";

  // Detalhes extras (ex: fila da frente, fila de trás, voz 1, etc.)
  if (lower.includes("fila da frente")) {
    const voice = material.voicePart ? capitalize(material.voicePart) : "Voz";
    return `${voice} (Fila da frente)`;
  }
  if (lower.includes("fila de tras")) {
    const voice = material.voicePart ? capitalize(material.voicePart) : "Voz";
    return `${voice} (Fila de trás)`;
  }
  if (lower.includes("baixo e tenor graves") || lower.includes("tenor e baixo")) {
    return "Tenor & Baixo";
  }
  if (lower.includes("soprano e tenor")) {
    return "Soprano & Tenor";
  }
  if (lower.includes("contralto e baixo")) {
    return "Contralto & Baixo";
  }
  if (lower.includes("contralto baritonos")) {
    return "Contralto & Barítono";
  }

  // Se tem voicePart definido, usa ele formatado
  if (material.voicePart) {
    return capitalize(material.voicePart);
  }

  return title;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Agrupa a lista de materiais em Obras Musicais estruturadas
 */
export function groupMaterialsIntoWorks(materials: Material[]): RepertoireWork[] {
  const groupsMap = new Map<string, { groupMeta: any; items: Material[] }>();

  for (const m of materials) {
    const groupKey = m.group?.slug || (m.groupId ? `group-${m.groupId}` : "sem-grupo");
    if (!groupsMap.has(groupKey)) {
      groupsMap.set(groupKey, { groupMeta: m.group, items: [] });
    }
    groupsMap.get(groupKey)!.items.push(m);
  }

  const works: RepertoireWork[] = [];

  for (const [key, { groupMeta, items }] of Array.from(groupsMap.entries())) {
    const known = KNOWN_WORKS[key];

    // Categoria e Títulos
    let cleanTitle = known?.cleanTitle || groupMeta?.name || "Obra Musical";
    let subtitle = known?.subtitle || groupMeta?.description || "";
    let category: "natal" | "missas" | "classicos" | "mpb" = known?.category || "classicos";
    let subCategory = known?.subCategory;

    if (!known) {
      const lower = key.toLowerCase();
      if (lower.includes("natal")) {
        category = "natal";
      } else if (lower.includes("missa")) {
        category = "missas";
        if (lower.includes("agosto")) subCategory = "Missa de Agosto";
        else if (lower.includes("maio")) subCategory = "Missa de Maio";
        else if (lower.includes("setembro")) subCategory = "Missa de Setembro";
      } else if (lower.includes("salmo") || lower.includes("mozart") || lower.includes("bach")) {
        category = "classicos";
      } else {
        category = "mpb";
      }
    }

    const catInfo = CATEGORY_INFO[category] || CATEGORY_INFO.classicos;

    const scores = items.filter((m: Material) => m.type === "score");
    const audios = items
      .filter((m: Material) => m.type === "audio")
      .sort((a: Material, b: Material) => {
        const orderA = VOICE_ORDER[a.voicePart?.toLowerCase() || ""] || 99;
        const orderB = VOICE_ORDER[b.voicePart?.toLowerCase() || ""] || 99;
        return orderA - orderB;
      });

    const voiceSet = new Set<string>();
    for (const a of audios) {
      if (a.voicePart) {
        voiceSet.add(a.voicePart.toLowerCase());
      }
    }

    works.push({
      id: groupMeta?.id || key,
      name: cleanTitle,
      subtitle,
      category,
      categoryLabel: catInfo.label,
      categoryColor: catInfo.color,
      categoryIcon: catInfo.icon,
      subCategory,
      scores,
      audios,
      allMaterials: items,
      availableVoices: Array.from(voiceSet),
    });
  }

  // Ordena obras: primeiro por categoria (Natal, Missas, Clássicos, MPB), depois alfabeticamente
  const categoryOrder: Record<string, number> = {
    natal: 1,
    missas: 2,
    classicos: 3,
    mpb: 4,
  };

  return works.sort((a, b) => {
    const catDiff = (categoryOrder[a.category] || 9) - (categoryOrder[b.category] || 9);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name, "pt-BR");
  });
}
