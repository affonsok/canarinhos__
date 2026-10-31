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
  IconUser,
  IconLogout,
  IconMicrophone,
} from "@tabler/icons-react";

export async function Header({
  hidePublicLinks = false,
}: {
  hidePublicLinks?: boolean;
} = {}) {
  const session = await getServerSession(authOptions);

  return (
    <Box
      component="header"
      style={{
        backgroundColor: "#1e3a5f",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}
      py="xs"
    >
      <Container size="lg">
        <Group justify="space-between" align="center">
          {/* Logo Oficial Canarinhos */}
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Group gap="xs">
              <Box
                component="img"
                src="/images/logo-canarinhos-transparent.png"
                alt="Logo Canarinhos"
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain",
                }}
              />
              <div>
                <Text
                  fw={800}
                  size="md"
                  style={{
                    letterSpacing: "0.02em",
                    color: "#fff",
                    lineHeight: 1.1,
                  }}
                >
                  Canarinhos de Campo Largo
                </Text>
                <Text size="xs" style={{ color: "#c9a227", fontWeight: 600 }}>
                  Instituto São Domingos Sávio
                </Text>
              </div>
            </Group>
          </Link>

          {/* Links e Botão Ensaios */}
          <Group gap="md">
            {!hidePublicLinks && !session?.user && (
              <>
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
                  href="/#edital-bolsistas"
                  style={{
                    textDecoration: "none",
                    color: "#e2e8f0",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Edital
                </Link>
              </>
            )}

            {session?.user ? (
              <Group gap="xs">
                <Badge
                  color="yellow.6"
                  variant="light"
                  size="lg"
                  radius="sm"
                  leftSection={<IconUser size={14} />}
                  style={{ color: "#c9a227" }}
                >
                  {session.user.name || "Aluno"}
                </Badge>
                <Button
                  component={Link}
                  href="/ensaios"
                  variant="filled"
                  color="yellow.6"
                  size="sm"
                  radius="md"
                  leftSection={<IconMicrophone size={16} />}
                  style={{ color: "#1e3a5f", fontWeight: 800 }}
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
                  leftSection={<IconLogout size={14} />}
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
                leftSection={<IconMicrophone size={16} />}
                style={{
                  color: "#1e3a5f",
                  fontWeight: 800,
                  boxShadow: "0 4px 14px rgba(201, 162, 39, 0.4)",
                }}
              >
                Área de Ensaios
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
