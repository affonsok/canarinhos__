async function verify() {
  const baseUrl = "http://localhost:3001";

  console.log("1. Fetching login page to get CSRF token...");
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = csrfRes.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

  console.log("2. Performing login as affonsokopmann...");
  const postBody = new URLSearchParams({
    csrfToken,
    login: "affonsokopmann",
    password: "123456",
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

  const sessionCookies = authRes.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  console.log("Login response status:", authRes.status);
  console.log("Session cookie received:", sessionCookies.includes("next-auth.session-token"));

  console.log("3. Fetching /ensaios page with session cookie...");
  const ensaiosRes = await fetch(`${baseUrl}/ensaios`, {
    headers: {
      Cookie: sessionCookies,
    },
  });

  console.log("/ensaios status:", ensaiosRes.status);
  console.log("Final page URL:", ensaiosRes.url);
  const html = await ensaiosRes.text();

  // Verificações essenciais
  const checks = [
    { name: "25 Obras na aba de Repertório", match: html.includes("25 Obras") },
    { name: "Categoria Natal 2026", match: html.includes("Natal 2026") },
    { name: "Categoria Missas & Liturgia", match: html.includes("Missas") },
    { name: "Categoria Clássico & Sacro", match: html.includes("Clássico") },
    { name: "Categoria MPB & Coral", match: html.includes("MPB") },
    { name: "Obra Ave Verum Corpus", match: html.includes("Ave Verum Corpus") },
    { name: "Obra Christmas Time Is Here", match: html.includes("Christmas Time Is Here") },
    { name: "Obra Jingle Bell Rock", match: html.includes("Jingle Bell Rock") },
    { name: "Obra Carinhoso", match: html.includes("Carinhoso") },
    { name: "Meu Naipe: baixo", match: html.includes("Meu Naipe") && html.includes("baixo") },
    { name: "Botão de Partitura Geral", match: html.includes("Partitura") },
    { name: "Modo Por Obra / Pastas", match: html.includes("Por Obra") || html.includes("Pastas") },
  ];

  console.log("\n=== RESULTADOS DA VERIFICAÇÃO ===");
  let passed = 0;
  for (const c of checks) {
    if (c.match) {
      console.log(`✅ ${c.name}`);
      passed++;
    } else {
      console.log(`❌ ${c.name}`);
    }
  }

  console.log(`\nTaxa de sucesso: ${passed}/${checks.length} (${Math.round((passed / checks.length) * 100)}%)`);

  if (passed === checks.length) {
    console.log("🎉 Todas as 12 verificações do novo Repertório Organizado passaram com 100% de sucesso!");
  } else {
    process.exit(1);
  }
}

verify().catch((err) => {
  console.error("Erro na verificação:", err);
  process.exit(1);
});
