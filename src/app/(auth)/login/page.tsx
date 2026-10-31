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
} from "@mantine/core";
import {
  IconUser,
  IconLock,
  IconAlertCircle,
  IconMusic,
  IconArrowLeft,
} from "@tabler/icons-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/ensaios";
  const [login, setLogin] = useState("affonsokopmann");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
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

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #edf4fb 0%, #f8fafc 100%)",
      }}
      py="xl"
    >
      <Container size={440} w="100%">
        <Stack align="center" mb="lg">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Group gap="xs">
              <Box
                component="img"
                src="/images/logo-canarinhos-transparent.png"
                alt="Logo Canarinhos"
                style={{
                  width: "56px",
                  height: "56px",
                  objectFit: "contain",
                }}
              />
              <div>
                <Text fw={800} size="xl" c="canarinhosBlue.7" style={{ letterSpacing: "0.02em" }}>
                  Canarinhos de Campo Largo
                </Text>
                <Text size="xs" c="canarinhosGold.7" fw={700}>
                  Área do Aluno • Ensaios
                </Text>
              </div>
            </Group>
          </Link>

          <Title ta="center" order={2} fw={800} c="dark.8" mt="xs">
            Acesso aos Ensaios
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Digite seu login de aluno e sua senha
          </Text>
        </Stack>

        <Paper withBorder shadow="md" p={30} radius="md" bg="white">
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {error && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  title="Erro de Acesso"
                  color="red"
                  radius="md"
                >
                  {error}
                </Alert>
              )}

              <TextInput
                label="Login do Aluno"
                description="Seu nome e sobrenome juntos (sem espaços)"
                placeholder="ex: affonsokopmann"
                required
                value={login}
                onChange={(e) => setLogin(e.currentTarget.value)}
                leftSection={<IconUser size={16} stroke={1.5} />}
                radius="md"
              />

              <PasswordInput
                label="Senha"
                placeholder="Sua senha"
                required
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                leftSection={<IconLock size={16} stroke={1.5} />}
                radius="md"
              />

              <Box
                p="xs"
                style={{
                  backgroundColor: "#fef9e8",
                  borderRadius: "8px",
                  border: "1px dashed #c9a227",
                }}
              >
                <Group justify="space-between">
                  <Text size="xs" fw={700} c="dark.8">
                    🔑 Login de Exemplo:
                  </Text>
                  <Badge size="xs" color="yellow.8" variant="light">
                    Pronto para testar
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
                radius="md"
                size="md"
                fw={700}
              >
                Entrar nos Ensaios
              </Button>
            </Stack>
          </form>

          <Group justify="space-between" mt="xl">
            <Anchor
              component={Link}
              href="/"
              c="dimmed"
              size="xs"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <IconArrowLeft size={12} /> Voltar ao início
            </Anchor>
            <Text c="dimmed" size="xs">
              Esqueceu? Fale com a regência.
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
          <Text c="dimmed">Carregando formulário de acesso...</Text>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
