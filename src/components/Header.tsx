import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  Container,
  Group,
  Button,
  Text,
  Badge,
  Box,
} from "@mantine/core";
import {
  IconMusic,
  IconUser,
  IconLogout,
  IconHeadphones,
} from "@tabler/icons-react";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <Box
      component="header"
      style={{
        backgroundColor: "#1e3a5f",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#fff",
      }}
      py="sm"
    >
      <Container size="lg">
        <Group justify="space-between" align="center">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Group gap="xs">
              <Box
                style={{
                  backgroundColor: "#c9a227",
                  color: "#1e3a5f",
                  borderRadius: "8px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconMusic size={22} stroke={2.5} />
              </Box>
              <div>
                <Text
                  fw={800}
                  size="lg"
                  style={{
                    letterSpacing: "0.08em",
                    color: "#fff",
                    lineHeight: 1.1,
                  }}
                >
                  CANARINHOS
                </Text>
                <Text size="xs" c="dimmed" style={{ color: "#c9a227" }}>
                  Música & Formação
                </Text>
              </div>
            </Group>
          </Link>

          {/* Links e Ações */}
          <Group gap="md">
            <Link
              href="/#historia"
              style={{
                textDecoration: "none",
                color: "#e2e8f0",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              História
            </Link>
            <Link
              href="/#atividades"
              style={{
                textDecoration: "none",
                color: "#e2e8f0",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Atividades
            </Link>

            {session?.user ? (
              <Group gap="xs">
                <Badge
                  color="yellow.6"
                  variant="light"
                  size="lg"
                  radius="sm"
                  leftSection={<IconUser size={14} />}
                >
                  {session.user.name || "Aluno"}
                </Badge>
                <Button
                  component={Link}
                  href="/ensaios"
                  variant="filled"
                  color="yellow.6"
                  size="xs"
                  radius="md"
                  leftSection={<IconHeadphones size={15} />}
                  style={{ color: "#1e3a5f", fontWeight: 700 }}
                >
                  Área de Ensaios
                </Button>
                <Button
                  component={Link}
                  href="/api/auth/signout"
                  variant="subtle"
                  color="gray.2"
                  size="xs"
                  radius="md"
                  leftSection={<IconLogout size={15} />}
                >
                  Sair
                </Button>
              </Group>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="filled"
                color="yellow.6"
                size="sm"
                radius="md"
                leftSection={<IconUser size={16} />}
                style={{ color: "#1e3a5f", fontWeight: 700 }}
              >
                Área do Aluno
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
