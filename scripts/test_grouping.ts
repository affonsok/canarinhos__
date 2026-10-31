import { prisma } from "../src/lib/prisma";
import { groupMaterialsIntoWorks } from "../src/lib/repertoireMetadata";

async function test() {
  const mats = await prisma.material.findMany({ include: { group: true } });
  const works = groupMaterialsIntoWorks(mats as any);
  console.log(`\n🎉 Total works grouped: ${works.length}`);
  for (const w of works) {
    console.log(
      `${w.categoryIcon} [${w.categoryLabel}${w.subCategory ? ` - ${w.subCategory}` : ""}] "${w.name}"`,
      `\n   Sub: ${w.subtitle}`,
      `\n   Scores: ${w.scores.length} | Audios: ${w.audios.length} | Naipes: [${w.availableVoices.join(", ")}]`
    );
  }
}

test().finally(() => prisma.$disconnect());
