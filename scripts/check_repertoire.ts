import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const groups = await prisma.materialGroup.findMany({
    include: {
      materials: {
        select: {
          id: true,
          title: true,
          type: true,
          voicePart: true,
          localPath: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  console.log(`Total groups: ${groups.length}`);
  for (const g of groups) {
    console.log(`\n=== Group: "${g.name}" (Slug: ${g.slug}, ID: ${g.id}) ===`);
    console.log(`Description: ${g.description || "N/A"}`);
    console.log(`Materials count: ${g.materials.length}`);
    for (const m of g.materials) {
      console.log(`  - [${m.type}] voice: "${m.voicePart || ""}" | title: "${m.title}"`);
    }
  }

  const unassigned = await prisma.material.findMany({
    where: { groupId: null },
    select: { id: true, title: true, type: true, voicePart: true },
  });
  console.log(`\n=== Unassigned Materials: ${unassigned.length} ===`);
  for (const m of unassigned) {
    console.log(`  - [${m.type}] voice: "${m.voicePart || ""}" | title: "${m.title}"`);
  }
}

main().finally(() => prisma.$disconnect());
