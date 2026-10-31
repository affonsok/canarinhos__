import { prisma } from "../src/lib/prisma";

async function test() {
  const audioMat = await prisma.material.findFirst({ where: { type: "audio" } });
  const scoreMat = await prisma.material.findFirst({ where: { type: "score" } });

  if (!audioMat || !scoreMat) {
    console.error("Materiais não encontrados!");
    process.exit(1);
  }

  const csrfRes = await fetch("http://localhost:3001/api/auth/csrf");
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = csrfRes.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");

  const postBody = new URLSearchParams({
    csrfToken,
    login: "affonsokopmann",
    password: "123456",
    json: "true",
  });

  const authRes = await fetch("http://localhost:3001/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: csrfCookies,
      "X-Auth-Return-Redirect": "1",
    },
    body: postBody.toString(),
  });

  const sessionCookies = authRes.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");

  // Teste da página de áudio
  const audioRes = await fetch(
    `http://localhost:3001/ensaios/material/${audioMat.id}`,
    { headers: { Cookie: sessionCookies } }
  );
  const audioHtml = await audioRes.text();
  console.log("Audio detail status:", audioRes.status);
  console.log("Has Console de Reprodução Vocal?", audioHtml.includes("Console de Reprodução Vocal"));
  console.log("Has Dicas de Ensaio Vocal?", audioHtml.includes("Uso de Fones de Ouvido"));
  console.log("Has Voltar ao Acervo?", audioHtml.includes("Voltar ao Acervo de Ensaios"));

  // Teste da página de partitura (PDF)
  const scoreRes = await fetch(
    `http://localhost:3001/ensaios/material/${scoreMat.id}`,
    { headers: { Cookie: sessionCookies } }
  );
  const scoreHtml = await scoreRes.text();
  console.log("\nScore detail status:", scoreRes.status);
  console.log("Has Partitura viewer?", scoreHtml.includes("Partitura:"));
  console.log("Has Tela Cheia button?", scoreHtml.includes("Tela Cheia"));
  console.log("Has Baixar PDF button?", scoreHtml.includes("Baixar PDF"));
}

test().finally(() => prisma.$disconnect());
