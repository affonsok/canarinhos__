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
  IconMail,
  IconLock,
  IconAlertCircle,
  IconMusic,
  IconArrowLeft,
  IconSparkles,
} from "@tabler/icons-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/ensaios";
  const [email, setEmail] = useState("aluno@canarinhos.com");
  const [password, setPassword] = useState("canarinhos123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
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
                style={{
                  backgroundColor: "#1e3a5f",
                  color: "#c9a227",
                  borderRadius: "10px",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconMusic size={26} stroke={2.5} />
              </Box>
              <Text fw={800} size="xl" c="canarinhosBlue.7" style={{ letterSpacing: "0.05em" }}>
                CANARINHOS
              </Text>
            </Group>
          </Link>

          <Title ta="center" order={2} fw={800} c="dark.8">
            Área do Aluno
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Acesse áudios de naipe, partituras e comunicados
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
                label="E-mail"
                placeholder="seu.email@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                leftSection={<IconMail size={16} stroke={1.5} />}
                radius="md"
              />

              <PasswordInput
                label="Senha"
                placeholder="Sua senha secreta"
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
                  <Text size="xs" fw={600} c="dark.7">
                    🔑 Credenciais de Teste:
                  </Text>
                  <Badge size="xs" color="yellow.8" variant="light">
                    Pronto para testar
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" mt={4}>
                  aluno@canarinhos.com / canarinhos123
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
                Entrar na Área de Ensaios
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
              Dúvidas? Fale com a regência.
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
