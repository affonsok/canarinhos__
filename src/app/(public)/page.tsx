import Link from "next/link";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  SimpleGrid,
  Card,
  ThemeIcon,
  Badge,
  Paper,
  Box,
  Stack,
} from "@mantine/core";
import {
  IconMicrophone,
  IconNotes,
  IconUsersGroup,
  IconCalendarEvent,
  IconArrowRight,
  IconSparkles,
  IconHeartHandshake,
} from "@tabler/icons-react";

export default function LandingPage() {
  const features = [
    {
      icon: IconMicrophone,
      title: "Ensaios & Técnica Vocal",
      description:
        "Afinação, sustentação, dicção e expressividade coral desenvolvidas com metodologia consagrada.",
      badge: "Semanal",
    },
    {
      icon: IconNotes,
      title: "Repertório Completo & Partituras",
      description:
        "Áudios guias separados por naipes (soprano, contralto, tenor, baixo) e partituras digitais sincronizadas.",
      badge: "Online",
    },
    {
      icon: IconCalendarEvent,
      title: "Concertos & Apresentações",
      description:
        "Participação em missas solenes, concertos natalinos, festivais de música e eventos cívico-culturais.",
      badge: "Temporada 2026",
    },
    {
      icon: IconHeartHandshake,
      title: "Formação Integral & Cidadã",
      description:
        "Mais do que música: convivência sadia, responsabilidade, trabalho coletivo e disciplina para a vida.",
      badge: "Valores",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        style={{
          background:
            "linear-gradient(135deg, #0e1e34 0%, #1e3a5f 60%, #162c4a 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
        py={{ base: 60, md: 100 }}
      >
        <Container size="lg">
          <Stack align="center" ta="center" gap="lg">
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "#c9a227", to: "#f6c332", deg: 45 }}
              leftSection={<IconSparkles size={14} />}
              style={{ color: "#1e3a5f", fontWeight: 700 }}
            >
              Tradição Coral & Formação Humana
            </Badge>

            <Title
              order={1}
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                color: "#ffffff",
                maxWidth: 800,
              }}
            >
              Vozes que encantam gerações há décadas
            </Title>

            <Text
              size="lg"
              style={{
                maxWidth: 680,
                color: "#cbd5e1",
                lineHeight: 1.6,
              }}
            >
              Portal oficial dos Canarinhos. Acompanhe nosso cronograma, estude seu
              repertório com áudios por naipe e acesse partituras onde você estiver.
            </Text>

            <Group gap="md" mt="md">
              <Button
                component={Link}
                href="/login"
                size="lg"
                radius="md"
                color="yellow.6"
                rightSection={<IconArrowRight size={18} />}
                style={{
                  color: "#1e3a5f",
                  fontWeight: 800,
                  boxShadow: "0 10px 25px -5px rgba(201, 162, 39, 0.4)",
                }}
              >
                Acessar Área do Aluno
              </Button>
              <Button
                component="a"
                href="#historia"
                size="lg"
                radius="md"
                variant="outline"
                color="gray.1"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                Conhecer a História
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Highlights Band */}
      <Container size="lg" mt={-30} style={{ position: "relative", zIndex: 10 }}>
        <Paper
          shadow="md"
          radius="lg"
          p="xl"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
          }}
        >
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            <Stack align="center" gap={4}>
              <Text fw={900} size="2rem" c="canarinhosBlue.7" lh={1}>
                90+
              </Text>
              <Text size="sm" fw={600} c="dark.6">
                Materiais de Estudo
              </Text>
              <Text size="xs" c="dimmed">
                Áudios de naipe e partituras
              </Text>
            </Stack>

            <Stack align="center" gap={4}>
              <Text fw={900} size="2rem" c="canarinhosGold.6" lh={1}>
                4 Naipes
              </Text>
              <Text size="sm" fw={600} c="dark.6">
                Harmonia Vocal
              </Text>
              <Text size="xs" c="dimmed">
                Soprano, Contralto, Tenor e Baixo
              </Text>
            </Stack>

            <Stack align="center" gap={4}>
              <Text fw={900} size="2rem" c="canarinhosBlue.7" lh={1}>
                100%
              </Text>
              <Text size="sm" fw={600} c="dark.6">
                Acesso Digital
              </Text>
              <Text size="xs" c="dimmed">
                Pratique no computador ou celular
              </Text>
            </Stack>
          </SimpleGrid>
        </Paper>
      </Container>

      {/* Activities / Features Section */}
      <Box id="atividades" py={{ base: 60, md: 80 }}>
        <Container size="lg">
          <Stack align="center" ta="center" mb={50}>
            <Badge color="canarinhosBlue" variant="light" size="lg">
              Pilares do Coro
            </Badge>
            <Title order={2} c="canarinhosBlue.7" fw={800}>
              Nossas Atividades
            </Title>
            <Text c="dimmed" maw={600}>
              Uma jornada completa de desenvolvimento artístico, musical e pessoal
              com ensaios organizados e material de apoio contínuo.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  shadow="sm"
                  padding="xl"
                  radius="md"
                  withBorder
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <div>
                    <Group justify="space-between" mb="md">
                      <ThemeIcon
                        size={46}
                        radius="md"
                        color="canarinhosBlue"
                        variant="light"
                      >
                        <Icon size={24} />
                      </ThemeIcon>
                      <Badge variant="outline" size="sm" color="gray.6">
                        {f.badge}
                      </Badge>
                    </Group>

                    <Text fw={700} size="md" c="dark.8" mb="xs">
                      {f.title}
                    </Text>

                    <Text size="sm" c="dimmed" lh={1.6}>
                      {f.description}
                    </Text>
                  </div>
                </Card>
              );
            })}
          </SimpleGrid>
        </Container>
      </Box>

      {/* History Section */}
      <Box
        id="historia"
        py={{ base: 60, md: 80 }}
        style={{ backgroundColor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}
      >
        <Container size="md">
          <Paper
            p={{ base: "lg", md: "2.5rem" }}
            radius="lg"
            withBorder
            shadow="sm"
            style={{
              backgroundColor: "#ffffff",
              borderLeft: "6px solid #1e3a5f",
            }}
          >
            <Badge color="yellow.6" variant="filled" size="sm" mb="sm" style={{ color: "#1e3a5f" }}>
              Memória & Legado
            </Badge>
            <Title order={2} c="canarinhosBlue.7" fw={800} mb="md">
              Nossa História
            </Title>
            <Text size="md" c="slate.8" lh={1.8} mb="md">
              Fundado com o propósito de unir educação musical rigorosa e formação cidadã,
              o projeto Canarinhos mantém viva uma das mais ricas tradições da música vocal.
              Ao longo de sua trajetória, gerações de jovens descobriram o poder transformador
              do canto coral e a beleza do trabalho em harmonia.
            </Text>
            <Text size="md" c="slate.8" lh={1.8} mb="xl">
              Nossos ensaios equilibram o rigor técnico da polifonia sacra e profana com a
              sensibilidade da música popular brasileira e internacional, formando cantores
              conscientes de sua arte e preparados para se apresentar nos mais diversos palcos.
            </Text>

            <Group>
              <Button
                component={Link}
                href="/login"
                variant="light"
                color="canarinhosBlue"
                rightSection={<IconArrowRight size={16} />}
              >
                Acessar Área Restrita de Ensaios
              </Button>
            </Group>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
