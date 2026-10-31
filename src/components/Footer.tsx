import { Container, Group, Text, Box } from "@mantine/core";
import { IconMusic } from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
  return (
    <Box
      component="footer"
      style={{
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
      py="xl"
      mt="auto"
    >
      <Container size="lg">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Box
              style={{
                backgroundColor: "#1e3a5f",
                color: "#c9a227",
                borderRadius: "6px",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconMusic size={18} stroke={2.5} />
            </Box>
            <Text fw={700} size="sm" c="dark.7">
              Canarinhos — Canto Coral & Tradição
            </Text>
          </Group>

          <Group gap="lg">
            <Link
              href="/#historia"
              style={{
                textDecoration: "none",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              História
            </Link>
            <Link
              href="/#atividades"
              style={{
                textDecoration: "none",
                fontSize: "13px",
                color: "#64748b",
              }}
            >
              Atividades
            </Link>
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                fontSize: "13px",
                color: "#1e3a5f",
                fontWeight: 600,
              }}
            >
              Acesso Aluno
            </Link>
          </Group>
        </Group>

        <Text ta="center" size="xs" c="dimmed" mt="md">
          © {new Date().getFullYear()} Canarinhos. Todos os direitos reservados.
        </Text>
      </Container>
    </Box>
  );
}
