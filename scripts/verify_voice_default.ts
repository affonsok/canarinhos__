import { prisma } from "../src/lib/prisma";

async function verifyVoiceDefault() {
  const baseUrl = "http://localhost:3001";

  console.log("=== 1. TESTE DE CADASTRO COM NAIPE VOCAL SELECIONADO ===");
  const testStudent = {
    name: "Isabella Prado",
    username: "isabellaprado",
    voicePart: "contralto",
    password: "password123",
  };

  // Garante que não existe previamente
  await prisma.user.deleteMany({
    where: { username: testStudent.username },
  });

  const regRes = await fetch(`${baseUrl}/api/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testStudent),
  });

  const regData = await regRes.json();
  console.log("Registro status:", regRes.status);
  console.log("Aluno criado com naipe:", regData.student?.voicePart);

  if (regData.student?.voicePart !== "contralto") {
    console.error("ERRO: O aluno não foi cadastrado com o naipe correto!");
    process.exit(1);
  }

  console.log("\n=== 2. TESTE DE LOGIN E DEFAULT DO NAIPE NA PÁGINA DE ENSAIOS ===");
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = csrfRes.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");

  const postBody = new URLSearchParams({
    csrfToken,
    login: testStudent.username,
    password: testStudent.password,
    json: "true",
  });

  const authRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
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

  const ensaiosRes = await fetch(`${baseUrl}/ensaios`, {
    headers: { Cookie: sessionCookies },
  });

  const html = await ensaiosRes.text();
  console.log("Status de /ensaios:", ensaiosRes.status);

  // Verificações essenciais solicitadas pelo usuário:
  const checks = [
    {
      name: "Modo Padrão Ativo para o Naipe do Aluno (CONTRALTO)",
      match: html.includes("Modo Padrão Ativo: Apenas CONTRALTO") || (html.includes("CONTRALTO") && html.includes("Padrão")),
    },
    {
      name: "Botão para Ver Todo o Repertório presente",
      match: html.includes("Ver Todo o Repertório"),
    },
    {
      name: "Naipe da cantora Isabella reconhecido",
      match: html.includes("Isabella Prado") && html.includes("Contralto"),
    },
    {
      name: "Botões de áudio com alvo de toque mobile-friendly",
      match: html.includes("min-h-[44px]"),
    },
  ];

  console.log("\nResultados do teste:");
  let passed = 0;
  for (const c of checks) {
    if (c.match) {
      console.log(`✅ ${c.name}`);
      passed++;
    } else {
      console.log(`❌ ${c.name}`);
    }
  }

  console.log(`\nTaxa de sucesso: ${passed}/${checks.length}`);
  if (passed === checks.length) {
    console.log("🎉 Teste de Cadastro com Naipe e Default 'Apenas Meu Naipe' aprovado com 100% de sucesso!");
  } else {
    process.exit(1);
  }
}

verifyVoiceDefault().catch((err) => {
  console.error("Erro no teste:", err);
  process.exit(1);
});
