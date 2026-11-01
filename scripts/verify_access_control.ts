async function verifyAccessControl() {
  const baseUrl = "http://localhost:3001";

  // Helper de login
  async function login(username: string, password: string) {
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    const { csrfToken } = await csrfRes.json();
    const csrfCookies = csrfRes.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");

    const postBody = new URLSearchParams({
      csrfToken,
      login: username,
      password,
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
    return sessionCookies;
  }

  console.log("=== 1. TESTE DE PERMISSÕES DO ALUNO (isabellaprado - role: member) ===");
  const studentCookies = await login("isabellaprado", "password123");

  const studentPageRes = await fetch(`${baseUrl}/ensaios`, {
    headers: { Cookie: studentCookies },
  });
  const studentHtml = await studentPageRes.text();

  const studentUiChecks = [
    { name: "Aluno NÃO vê aba 'Agenda de Compromissos'", pass: !studentHtml.includes("Agenda de Compromissos") },
    { name: "Aluno NÃO vê aba 'Ranking de Dedicação'", pass: !studentHtml.includes("Ranking de Dedicação") },
    { name: "Aluno NÃO vê aba 'Gestão de Alunos'", pass: !studentHtml.includes("Gestão de Alunos") },
    { name: "Aluno NÃO vê 'Posição no Coro'", pass: !studentHtml.includes("Posição no Coro") },
    { name: "Aluno vê seu Repertório e Naipe Contralto", pass: studentHtml.includes("CONTRALTO") && studentHtml.includes("Repertório") },
  ];

  for (const c of studentUiChecks) {
    console.log(c.pass ? `✅ ${c.name}` : `❌ ${c.name}`);
    if (!c.pass) throw new Error(`Falha no teste: ${c.name}`);
  }

  // API checks para Aluno (esperado: 403 Forbidden)
  const studentApiEndpoints = [
    { name: "GET /api/students", url: `${baseUrl}/api/students`, method: "GET" },
    { name: "POST /api/students", url: `${baseUrl}/api/students`, method: "POST", body: { name: "Hacker", username: "hacker", password: "123" } },
    { name: "PUT /api/students", url: `${baseUrl}/api/students`, method: "PUT", body: { id: "123", name: "Hacker" } },
    { name: "DELETE /api/students", url: `${baseUrl}/api/students?id=123`, method: "DELETE" },
    { name: "GET /api/events", url: `${baseUrl}/api/events`, method: "GET" },
    { name: "POST /api/events", url: `${baseUrl}/api/events`, method: "POST", body: { title: "Falso Evento", eventDate: "2026-12-01T10:00" } },
    { name: "PUT /api/events", url: `${baseUrl}/api/events`, method: "PUT", body: { id: "123", title: "Falso Evento", eventDate: "2026-12-01T10:00" } },
    { name: "DELETE /api/events", url: `${baseUrl}/api/events?id=123`, method: "DELETE" },
    { name: "GET /api/ranking", url: `${baseUrl}/api/ranking`, method: "GET" },
  ];

  for (const ep of studentApiEndpoints) {
    const res = await fetch(ep.url, {
      method: ep.method,
      headers: {
        "Content-Type": "application/json",
        Cookie: studentCookies,
      },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    });

    const isBlocked = res.status === 403;
    console.log(isBlocked ? `✅ Aluno bloqueado em ${ep.name} (HTTP 403)` : `❌ Aluno obteve ${res.status} em ${ep.name}`);
    if (!isBlocked) throw new Error(`Aluno não foi bloqueado em ${ep.name}! Status: ${res.status}`);
  }

  console.log("\n=== 2. TESTE DE PERMISSÕES DO REGENTE / ADMIN (affonsokopmann - role: admin) ===");
  const adminCookies = await login("affonsokopmann", "123456");

  const adminPageRes = await fetch(`${baseUrl}/ensaios`, {
    headers: { Cookie: adminCookies },
  });
  const adminHtml = await adminPageRes.text();

  const adminUiChecks = [
    { name: "Admin VÊ aba 'Repertório Geral'", pass: adminHtml.includes("Repertório Geral") },
    { name: "Admin VÊ aba 'Agenda de Compromissos'", pass: adminHtml.includes("Agenda de Compromissos") },
    { name: "Admin VÊ aba 'Ranking de Dedicação'", pass: adminHtml.includes("Ranking de Dedicação") },
    { name: "Admin VÊ aba 'Gestão de Alunos'", pass: adminHtml.includes("Gestão de Alunos") },
    { name: "Admin VÊ 'Painel de Regência'", pass: adminHtml.includes("Painel de Regência") },
  ];

  for (const c of adminUiChecks) {
    console.log(c.pass ? `✅ ${c.name}` : `❌ ${c.name}`);
    if (!c.pass) throw new Error(`Falha no teste: ${c.name}`);
  }

  // API CRUD de Eventos pelo Admin (Criar, Alterar, Apagar)
  console.log("\n=== 3. TESTE DE CRUD COMPLETO DA AGENDA PELO ADMIN ===");
  // Criar
  const createRes = await fetch(`${baseUrl}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookies },
    body: JSON.stringify({
      title: "Missa Teste Automatizada",
      eventDate: "2026-11-20T19:00:00.000Z",
      location: "Igreja Matriz",
      description: "Ensaio geral teste",
      materialIds: [],
    }),
  });
  const createData = await createRes.json();
  console.log(`✅ Admin criou compromisso: status ${createRes.status}, id: ${createData.event?.id}`);
  if (createRes.status !== 200 || !createData.event?.id) throw new Error("Admin falhou ao criar compromisso");

  const eventId = createData.event.id;

  // Alterar (PUT)
  const updateRes = await fetch(`${baseUrl}/api/events`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: adminCookies },
    body: JSON.stringify({
      id: eventId,
      title: "Missa Teste Alterada",
      eventDate: "2026-11-20T20:00:00.000Z",
      location: "Igreja Matriz - Altar",
      description: "Horário atualizado para 20h",
      materialIds: [],
    }),
  });
  const updateData = await updateRes.json();
  console.log(`✅ Admin alterou compromisso: status ${updateRes.status}, novo título: ${updateData.event?.title}`);
  if (updateRes.status !== 200 || updateData.event?.title !== "Missa Teste Alterada") {
    throw new Error("Admin falhou ao alterar compromisso");
  }

  // Apagar (DELETE)
  const deleteRes = await fetch(`${baseUrl}/api/events?id=${eventId}`, {
    method: "DELETE",
    headers: { Cookie: adminCookies },
  });
  const deleteData = await deleteRes.json();
  console.log(`✅ Admin apagou compromisso: status ${deleteRes.status}, deletedId: ${deleteData.deletedId}`);
  if (deleteRes.status !== 200 || deleteData.deletedId !== eventId) {
    throw new Error("Admin falhou ao apagar compromisso");
  }

  // Ranking & Alunos pelo Admin
  const rankingRes = await fetch(`${baseUrl}/api/ranking`, {
    headers: { Cookie: adminCookies },
  });
  console.log(`✅ Admin consultou ranking: status ${rankingRes.status}`);
  if (rankingRes.status !== 200) throw new Error("Admin falhou ao consultar ranking");

  const studentsRes = await fetch(`${baseUrl}/api/students`, {
    headers: { Cookie: adminCookies },
  });
  console.log(`✅ Admin consultou alunos: status ${studentsRes.status}`);
  if (studentsRes.status !== 200) throw new Error("Admin falhou ao consultar alunos");

  console.log("\n🎉 TODOS OS TESTES DE CONTROLE DE ACESSO REGENTE vs ALUNO PASSARAM COM 100% DE SUCESSO!");
}

verifyAccessControl().catch((err) => {
  console.error("Erro no teste de controle de acesso:", err);
  process.exit(1);
});
