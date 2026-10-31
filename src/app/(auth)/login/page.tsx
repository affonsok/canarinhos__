"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Group,
  Box,
  Anchor,
  Stack,
  Badge,
  SegmentedControl,
  SimpleGrid,
} from "@mantine/core";
import {
  IconUser,
  IconLock,
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconUserPlus,
  IconLogin,
  IconMicrophone,
} from "@tabler/icons-react";

function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/ensaios";
  const defaultTab = searchParams.get("tab") === "cadastro" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(defaultTab as any);

  // Campos de Login
  const [login, setLogin] = useState("affonsokopmann");
  const [password, setPassword] = useState("123456");

  // Campos de Cadastro
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regVoicePart, setRegVoicePart] = useState("soprano");
  const [regPassword, setRegPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Atualiza username sugerido ao digitar o nome
  function handleNameChange(name: string) {
    setRegName(name);
    setRegUsername(sanitizeUsername(name));
  }

  // Submit de Login
  async function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      login: login.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciais inválidas. Verifique seu login e senha.");
      return;
    }

    window.location.href = result?.url || callbackUrl;
  }

  // Submit de Cadastro com Naipe Vocal
  async function handleRegisterSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!regName.trim() || !regPassword.trim()) {
      setError("Por favor, preencha seu nome completo e crie uma senha.");
      return;
    }

    const cleanUser = regUsername.trim()
      ? sanitizeUsername(regUsername)
      : sanitizeUsername(regName);

    if (!cleanUser) {
      setError("Login de aluno inválido. Digite apenas letras e números.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          username: cleanUser,
          voicePart: regVoicePart,
          password: regPassword,
          role: "member",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar cadastro.");
      }

      setSuccess(`Cadastro realizado com sucesso como ${regVoicePart.toUpperCase()}! Entrando...`);

      // Faz login automático após cadastrar
      const loginRes = await signIn("credentials", {
        login: cleanUser,
        password: regPassword,
        redirect: false,
        callbackUrl,
      });

      if (loginRes?.error) {
        setError("Cadastro criado! Faça login com seu novo usuário.");
        setMode("login");
        setLogin(cleanUser);
        setPassword(regPassword);
      } else {
        window.location.href = loginRes?.url || callbackUrl;
      }
    } catch (err: any) {
      setError(err.message || "Falha ao registrar novo coralista.");
    } finally {
      setLoading(false);
    }
  }

  const voiceOptions = [
    { value: "soprano", label: "🌸 Soprano", desc: "Voz aguda feminina / infantil" },
    { value: "contralto", label: "🍇 Contralto", desc: "Voz média / grave feminina" },
    { value: "tenor", label: "🔷 Tenor", desc: "Voz aguda masculina" },
    { value: "baixo", label: "🟦 Baixo", desc: "Voz grave masculina" },
    { value: "baritono", label: "🎵 Barítono", desc: "Voz intermediária masculina" },
    { value: "todos", label: "👥 Todos / Tutti", desc: "Todas as vozes ou iniciante" },
  ];

  return (
    <Box
      className="bg-[#f8fafc] min-h-screen flex items-center justify-center p-3 sm:p-6"
    >
      <Container size={460} w="100%" className="px-0">
        <Stack align="center" mb="lg">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Group gap="xs">
              <Box
                component="img"
                src="/images/logo-canarinhos-transparent.png"
                alt="Logo Canarinhos"
                style={{
                  width: "52px",
                  height: "52px",
                  objectFit: "contain",
                }}
              />
              <div>
                <Text fw={800} size="xl" c="canarinhosBlue.7" style={{ letterSpacing: "0.02em", lineHeight: 1.1 }}>
                  Canarinhos de Campo Largo
                </Text>
                <Text size="xs" c="canarinhosGold.7" fw={700}>
                  Área do Cantor • Portal de Ensaios
                </Text>
              </div>
            </Group>
          </Link>
        </Stack>

        <Paper withBorder shadow="sm" p={{ base: "lg", sm: "xl" }} radius="24px" bg="white" className="border-slate-200/90">
          {/* Alternador Mobile-First: Entrar vs Cadastrar */}
          <SegmentedControl
            fullWidth
            size="md"
            radius="xl"
            value={mode}
            onChange={(val) => {
              setMode(val as any);
              setError(null);
            }}
            data={[
              {
                value: "login",
                label: (
                  <div className="flex items-center justify-center gap-1.5 py-1 font-bold text-xs sm:text-sm">
                    <IconLogin size={16} />
                    <span>Já sou Aluno</span>
                  </div>
                ),
              },
              {
                value: "register",
                label: (
                  <div className="flex items-center justify-center gap-1.5 py-1 font-bold text-xs sm:text-sm">
                    <IconUserPlus size={16} />
                    <span>Novo Coralista</span>
                  </div>
                ),
              },
            ]}
            className="mb-5 bg-slate-100 p-1 border border-slate-200"
          />

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Atenção"
              color="red"
              radius="md"
              mb="md"
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              icon={<IconCheck size={16} />}
              title="Tudo certo!"
              color="teal"
              radius="md"
              mb="md"
            >
              {success}
            </Alert>
          )}

          {/* ============================================================== */}
          {/* FORMULÁRIO 1: LOGIN DO ALUNO                                   */}
          {/* ============================================================== */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Login do Aluno"
                  description="Nome e sobrenome juntos (sem espaços)"
                  placeholder="ex: affonsokopmann"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.currentTarget.value)}
                  leftSection={<IconUser size={16} stroke={1.5} />}
                  radius="md"
                  size="md"
                />

                <PasswordInput
                  label="Senha"
                  placeholder="Sua senha"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  leftSection={<IconLock size={16} stroke={1.5} />}
                  radius="md"
                  size="md"
                />

                <Box
                  p="xs"
                  className="rounded-xl bg-amber-50/70 border border-amber-200/80"
                >
                  <Group justify="space-between">
                    <Text size="xs" fw={700} c="dark.8">
                      🔑 Login Demo:
                    </Text>
                    <Badge size="xs" color="yellow.8" variant="light">
                      Teste Rápido
                    </Badge>
                  </Group>
                  <Text size="xs" c="dark.6" mt={4}>
                    Login: <strong>affonsokopmann</strong> / Senha: <strong>123456</strong>
                  </Text>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  color="canarinhosBlue"
                  radius="xl"
                  size="md"
                  fw={800}
                  className="h-12 shadow-sm bg-[#0c1e38] hover:bg-[#162c4a]"
                >
                  Entrar nos Ensaios
                </Button>
              </Stack>
            </form>
          ) : (
            /* ============================================================== */
            /* FORMULÁRIO 2: CADASTRO COM NAIPE VOCAL OBRIGATÓRIO              */
            /* ============================================================== */
            <form onSubmit={handleRegisterSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Nome Completo do Cantor(a)"
                  placeholder="Ex: Maria Clara Santos"
                  required
                  value={regName}
                  onChange={(e) => handleNameChange(e.currentTarget.value)}
                  leftSection={<IconUser size={16} stroke={1.5} />}
                  radius="md"
                  size="md"
                />

                <TextInput
                  label="Login de Acesso"
                  description="Gerado automaticamente (sem espaços)"
                  placeholder="ex: mariaclarasantos"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.currentTarget.value)}
                  radius="md"
                  size="md"
                />

                {/* Seleção do Naipe Vocal (Mobile-First Touch Cards) */}
                <div>
                  <Text size="sm" fw={700} c="dark.8" mb={4}>
                    Selecione o seu Naipe Vocal *
                  </Text>
                  <Text size="xs" c="dimmed" mb={8}>
                    Sua página de ensaios abrirá filtrada automaticamente para a sua voz.
                  </Text>

                  <div className="grid grid-cols-2 gap-2">
                    {voiceOptions.map((v) => {
                      const isSelected = regVoicePart === v.value;
                      return (
                        <button
                          key={v.value}
                          type="button"
                          onClick={() => setRegVoicePart(v.value)}
                          className={`p-2.5 rounded-xl text-left border transition-all ${
                            isSelected
                              ? "bg-[#0c1e38] text-white border-[#0c1e38] shadow-xs font-bold"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold">{v.label}</span>
                            {isSelected && (
                              <IconCheck size={14} className="text-[#fde047]" />
                            )}
                          </div>
                          <span
                            className={`text-[10px] block leading-tight ${
                              isSelected ? "text-slate-300" : "text-slate-400"
                            }`}
                          >
                            {v.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <PasswordInput
                  label="Crie uma Senha"
                  placeholder="Mínimo 4 caracteres (ex: 123456)"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.currentTarget.value)}
                  leftSection={<IconLock size={16} stroke={1.5} />}
                  radius="md"
                  size="md"
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  color="yellow.6"
                  radius="xl"
                  size="md"
                  fw={800}
                  className="h-12 shadow-sm text-[#0c1e38] bg-[#c9a227] hover:bg-[#b58f1f]"
                >
                  Concluir Cadastro e Iniciar Ensaios
                </Button>
              </Stack>
            </form>
          )}

          <Group justify="space-between" mt="xl" pt="sm" className="border-t border-slate-100">
            <Anchor
              component={Link}
              href="/"
              c="dimmed"
              size="xs"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <IconArrowLeft size={12} /> Início
            </Anchor>
            <Text c="dimmed" size="xs">
              Canarinhos de Campo Largo • Desde 1974
            </Text>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
          <Text c="dimmed">Carregando portal dos Canarinhos...</Text>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
