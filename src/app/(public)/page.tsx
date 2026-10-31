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
  Divider,
} from "@mantine/core";
import {
  IconMicrophone,
  IconNotes,
  IconUsersGroup,
  IconCalendarEvent,
  IconArrowRight,
  IconSparkles,
  IconHeartHandshake,
  IconMusic,
  IconCheck,
  IconExternalLink,
  IconAward,
  IconBook,
  IconMapPin,
} from "@tabler/icons-react";

export default function LandingPage() {
  const timeline = [
    {
      year: "1989",
      title: "Fundação pelo Maestro Théo de Petrus",
      desc: "Fundado em 1989 pelo Maestro Teodolino José de Souza (Maestro Théo de Petrus), iniciando a trajetória de formação coral em Campo Largo.",
    },
    {
      year: "1994",
      title: "Independência e Pueri Cantores",
      desc: "O Coro tornou-se independente com sua própria associação e filiou-se à Federação Nacional dos Meninos Cantores do Brasil (Pueri Cantores).",
    },
    {
      year: "2017",
      title: "Congresso Internacional no Rio de Janeiro",
      desc: "Presença de destaque no XLI Congresso Internacional dos Pueri Cantores, reunindo coros de diversas partes do mundo.",
    },
    {
      year: "2018",
      title: "Teatro Positivo & Ópera de Arame",
      desc: "Participação no Grande Concerto de Natal de Curitiba no Teatro Positivo e no musical Alice e o Natal das Maravilhas na Ópera de Arame.",
    },
    {
      year: "2019",
      title: "30 Anos de História & Sede do XVI Congresso",
      desc: "O coro celebrou 30 anos sediando em Campo Largo o XVI Congresso Nacional da Federação dos Meninos Cantores do Brasil.",
    },
    {
      year: "2020",
      title: "Legado e Expansão",
      desc: "Com o falecimento do Maestro Théo de Petrus, a instituição se reorganizou e expandiu suas oficinas com aulas de metais, cordas, fanfarra e ballet.",
    },
    {
      year: "2023",
      title: "Roma & Audiência com o Papa Francisco",
      desc: "Participação histórica no XLIV International Congress Pueri Cantores em Roma, cantando na Basílica de São Pedro e encontrando o Papa Francisco.",
    },
    {
      year: "2024",
      title: "XV Congresso Regional Sul em Campo Largo",
      desc: "Campo Largo sediou o congresso regional acolhendo cerca de 300 congressistas em paróquias hospedeiras.",
    },
    {
      year: "2025 - 2026",
      title: "Rumo ao Panamá e Novos Horizontes",
      desc: "Participação no XVIII Congresso em Minas Gerais e convite oficial para o 1º Congresso Latino-Americano no Panamá.",
    },
  ];

  return (
    <Box>
      {/* Hero Section Oficial com Background e Logo Real */}
      <Box
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `linear-gradient(rgba(14, 30, 52, 0.78), rgba(14, 30, 52, 0.88)), url('/images/canarinhos-performance.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#ffffff",
          textAlign: "center",
        }}
        py={{ base: 60, md: 100 }}
      >
        <Container size="md" style={{ position: "relative", zIndex: 2 }}>
          <Stack align="center" gap="md">
            {/* Logo Oficial dos Canarinhos */}
            <Box
              component="img"
              src="/images/logo-canarinhos-transparent.png"
              alt="Logo Canarinhos de Campo Largo"
              style={{
                width: "130px",
                height: "130px",
                objectFit: "contain",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
              }}
            />

            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "#c9a227", to: "#f6c332", deg: 45 }}
              style={{ color: "#1e3a5f", fontWeight: 800 }}
            >
              Instituto de Canto e Música São Domingos Sávio
            </Badge>

            <Title
              order={1}
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Canarinhos de Campo Largo
            </Title>

            <Text
              size="md"
              style={{
                color: "#c9a227",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Instituto Maestro Théo de Petrus
            </Text>

            <Text
              size="lg"
              style={{
                maxWidth: 680,
                color: "#e2e8f0",
                lineHeight: 1.6,
              }}
            >
              Formando talentos musicais, cidadania e encantando gerações há mais de três décadas através da excelência do canto coral infantil e juvenil.
            </Text>

            <Group gap="md" mt="lg">
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
                  boxShadow: "0 8px 24px rgba(201, 162, 39, 0.45)",
                }}
              >
                Acessar Área de Ensaios
              </Button>
              <Button
                component="a"
                href="#historia"
                size="lg"
                radius="md"
                variant="outline"
                color="gray.1"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                Conhecer a História
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Faixa de Destaques e Reconhecimento */}
      <Container size="lg" mt={-40} style={{ position: "relative", zIndex: 10 }}>
        <Paper
          shadow="lg"
          radius="lg"
          p="xl"
          bg="white"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            <Group gap="md" wrap="nowrap">
              <ThemeIcon size={52} radius="md" color="canarinhosBlue" variant="light">
                <IconAward size={28} />
              </ThemeIcon>
              <div>
                <Text fw={800} size="xl" c="canarinhosBlue.7">
                  Desde 1989
                </Text>
                <Text size="xs" c="dimmed">
                  Mais de 35 anos de tradição e formação musical
                </Text>
              </div>
            </Group>

            <Group gap="md" wrap="nowrap">
              <ThemeIcon size={52} radius="md" color="yellow.7" variant="light">
                <IconSparkles size={28} />
              </ThemeIcon>
              <div>
                <Text fw={800} size="xl" c="canarinhosGold.6">
                  Pueri Cantores
                </Text>
                <Text size="xs" c="dimmed">
                  Membros da Federação Nacional e Internacional
                </Text>
              </div>
            </Group>

            <Group gap="md" wrap="nowrap">
              <ThemeIcon size={52} radius="md" color="teal" variant="light">
                <IconNotes size={28} />
              </ThemeIcon>
              <div>
                <Text fw={800} size="xl" c="teal.7">
                  Repertório & Ensaios
                </Text>
                <Text size="xs" c="dimmed">
                  Áudios por naipe e partituras sincronizadas
                </Text>
              </div>
            </Group>
          </SimpleGrid>
        </Paper>
      </Container>

      {/* Seção História Oficial */}
      <Box id="historia" py={{ base: 60, md: 80 }}>
        <Container size="lg">
          <Stack align="center" ta="center" mb={50}>
            <Badge color="canarinhosBlue" variant="light" size="lg">
              Linha do Tempo
            </Badge>
            <Title order={2} c="canarinhosBlue.7" fw={900}>
              Nossa História
            </Title>
            <Text c="dimmed" maw={640}>
              Uma trajetória de devoção, perseverança e arte que levou a voz das crianças de Campo Largo aos maiores palcos do Brasil e do mundo.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {timeline.map((item) => (
              <Card
                key={item.year}
                shadow="xs"
                padding="lg"
                radius="md"
                withBorder
                bg="white"
                style={{
                  borderTop: "4px solid #1e3a5f",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Badge size="lg" color="yellow.7" variant="filled" mb="sm" style={{ color: "#1e3a5f" }}>
                    {item.year}
                  </Badge>
                  <Text fw={700} size="md" c="canarinhosBlue.7" mb="xs">
                    {item.title}
                  </Text>
                  <Text size="sm" c="dark.6" lh={1.6}>
                    {item.desc}
                  </Text>
                </div>
              </Card>
            ))}
          </SimpleGrid>

          <Paper withBorder p="xl" radius="lg" mt="xl" bg="white">
            <Group justify="space-between" align="center" wrap="wrap" gap="md">
              <div style={{ maxWidth: "600px" }}>
                <Text fw={700} size="lg" c="canarinhosBlue.7">
                  Manutenção & Expansão Institucional
                </Text>
                <Text size="sm" c="dimmed" mt={4} lh={1.6}>
                  A instituição se mantém com a doação generosa de voluntários, cachês de apresentações e subvenções municipais. O objetivo permanente inclui a sustentabilidade da Orquestra de Cordas e da Banda Marcial.
                </Text>
              </div>
              <Button
                component={Link}
                href="/login"
                color="canarinhosBlue"
                radius="md"
                rightSection={<IconArrowRight size={16} />}
              >
                Área do Aluno / Ensaios
              </Button>
            </Group>
          </Paper>
        </Container>
      </Box>

      {/* Seção Edital & Bolsistas */}
      <Box
        id="edital-bolsistas"
        py={{ base: 50, md: 70 }}
        style={{ backgroundColor: "#f1f5f9", borderTop: "1px solid #e2e8f0" }}
      >
        <Container size="md">
          <Paper p={{ base: "lg", md: "2.5rem" }} radius="lg" withBorder bg="white" shadow="sm">
            <Badge color="yellow.7" variant="light" size="md" mb="xs">
              Oportunidade & Formação
            </Badge>
            <Title order={2} c="canarinhosBlue.7" fw={800} mb="sm">
              Edital de Apoio & Bolsistas
            </Title>
            <Text size="md" c="dark.7" lh={1.7} mb="md">
              O Instituto de Canto e Música São Domingos Sávio promove editais periódicos para novos talentos, oferecendo gratuidade em aulas de canto coral, percepção musical, instrumentos e suporte para apresentações cívicas e religiosas.
            </Text>
            <Group>
              <Button
                component="a"
                href="https://www.canarinhosdecampolargo.com.br/transparencia-fomento-funarte"
                target="_blank"
                rel="noreferrer"
                variant="outline"
                color="canarinhosBlue"
                radius="md"
                leftSection={<IconExternalLink size={16} />}
              >
                Transparência & Fomento FUNARTE
              </Button>
            </Group>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
