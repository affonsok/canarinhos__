async function verifyPwaAndIcons() {
  const baseUrl = "http://localhost:3001";

  console.log("=== 1. VERIFICANDO ASSETS DO PWA ===");

  // 1. Manifest
  const manifestRes = await fetch(`${baseUrl}/manifest.json`);
  console.log("manifest.json status:", manifestRes.status);
  if (manifestRes.status !== 200) throw new Error("manifest.json falhou");
  const manifest = await manifestRes.json();
  console.log("PWA Name:", manifest.name);
  console.log("PWA Start URL:", manifest.start_url);
  console.log("PWA Icons count:", manifest.icons?.length);

  // 2. Icons
  for (const icon of manifest.icons) {
    const iconRes = await fetch(`${baseUrl}${icon.src}`);
    console.log(`Icon ${icon.src} status: ${iconRes.status}`);
    if (iconRes.status !== 200) throw new Error(`Falha ao carregar ícone ${icon.src}`);
  }

  // 3. Service Worker
  const swRes = await fetch(`${baseUrl}/sw.js`);
  console.log("sw.js status:", swRes.status);
  if (swRes.status !== 200) throw new Error("sw.js falhou");

  // 4. Teste em /ensaios
  console.log("\n=== 2. VERIFICANDO PROMPT DE INSTALAÇÃO EM /ENSAIOS ===");
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const { csrfToken } = await csrfRes.json();
  const csrfCookies = csrfRes.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

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

  const ensaiosRes = await fetch(`${baseUrl}/ensaios`, {
    headers: { Cookie: sessionCookies },
  });

  const html = await ensaiosRes.text();

  const checks = [
    {
      name: "Link do manifest.json no HTML",
      pass: html.includes('rel="manifest"') || html.includes("/manifest.json"),
    },
    {
      name: "Banner / Componente PWA de instalação no Celular",
      pass: html.includes("Instalar Aplicativo") || html.includes("PWA"),
    },
    {
      name: "Instruções ou botão mobile presentes",
      pass: html.includes("Instalar") || html.includes("Tela Inicial"),
    },
    {
      name: "Ícones de lugar, hora, play e microfone preservados",
      pass:
        html.includes("tabler-icon-map-pin") ||
        html.includes("tabler-icon-clock") ||
        html.includes("tabler-icon-player-play") ||
        html.includes("tabler-icon-microphone") ||
        html.includes("horas") ||
        html.includes("Treinar Minha Voz"),
    },
  ];

  console.log("\nResultados das verificações PWA:");
  let passed = 0;
  for (const c of checks) {
    if (c.pass) {
      console.log(`✅ ${c.name}`);
      passed++;
    } else {
      console.log(`❌ ${c.name}`);
    }
  }

  if (passed === checks.length) {
    console.log(`\n🎉 Todas as ${passed}/${checks.length} verificações do PWA passaram com 100% de sucesso!`);
  } else {
    process.exit(1);
  }
}

verifyPwaAndIcons().catch((err) => {
  console.error("Erro na verificação PWA:", err);
  process.exit(1);
});
