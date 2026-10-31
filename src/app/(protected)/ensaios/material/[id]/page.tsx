import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  Container,
  Title,
  Text,
  Badge,
  Group,
  Button,
  Paper,
  Box,
  Stack,
  Alert,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendar,
  IconHeadphones,
  IconFileText,
  IconInfoCircle,
} from "@tabler/icons-react";
import { AudioPlayer } from "@/components/AudioPlayer";
import { PdfViewer } from "@/components/PdfViewer";
import type { Material } from "@/components/types";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MaterialDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const dbMaterial = await prisma.material.findUnique({
    where: { id: params.id },
    include: { group: true },
  });

  if (!dbMaterial) notFound();

  const material: Material = {
    id: dbMaterial.id,
    title: dbMaterial.title,
    type: dbMaterial.type as Material["type"],
    voicePart: dbMaterial.voicePart,
    driveId: dbMaterial.driveId,
    localPath: dbMaterial.localPath,
    uploadedAt: dbMaterial.uploadedAt.toISOString(),
  };

  const rawPath = material.localPath || material.driveId || "";
  const mediaSrc =
    rawPath && !rawPath.startsWith("http") && !rawPath.startsWith("/")
      ? `/${rawPath}`
      : rawPath;

  const isAudio = material.type === "audio";

  return (
    <Box py="xl" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container size="md">
        {/* Navegação de Retorno */}
        <Box mb="lg">
          <Button
            component={Link}
            href="/ensaios"
            variant="subtle"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            radius="md"
          >
            Voltar para a Área de Ensaios
          </Button>
        </Box>

        {/* Cabeçalho do Material */}
        <Paper withBorder shadow="xs" p="xl" radius="lg" mb="xl" bg="white">
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <Badge
                  color={isAudio ? "blue" : "orange"}
                  variant="light"
                  size="md"
                  leftSection={
                    isAudio ? (
                      <IconHeadphones size={14} />
                    ) : (
                      <IconFileText size={14} />
                    )
                  }
                >
                  {isAudio ? "Áudio de Ensaio" : "Partitura"}
                </Badge>

                {material.voicePart && (
                  <Badge color="indigo" variant="outline" size="md">
                    Naipe: {material.voicePart}
                  </Badge>
                )}

                {dbMaterial.group && (
                  <Badge color="gray" variant="dot" size="md">
                    {dbMaterial.group.name}
                  </Badge>
                )}
              </Group>

              <Group gap={6} c="dimmed">
                <IconCalendar size={14} />
                <Text size="xs">
                  {new Date(material.uploadedAt).toLocaleDateString("pt-BR")}
                </Text>
              </Group>
            </Group>

            <Title order={1} fw={800} c="canarinhosBlue.7" mt="xs">
              {material.title}
            </Title>
          </Stack>
        </Paper>

        {/* Player de Áudio ou Visualizador de PDF */}
        <Box mb="xl">
          {!mediaSrc ? (
            <Paper withBorder p="xl" radius="md" ta="center" bg="white">
              <Text c="dimmed">Arquivo indisponível para este material.</Text>
            </Paper>
          ) : isAudio ? (
            <AudioPlayer
              src={mediaSrc}
              title={material.title}
              materialId={material.id}
            />
          ) : (
            <PdfViewer src={mediaSrc} title={material.title} />
          )}
        </Box>

        {/* Dicas de Estudo para o Coro */}
        {isAudio && (
          <Alert
            icon={<IconInfoCircle size={18} />}
            title="Dicas de Estudo Vocal"
            color="canarinhosBlue"
            radius="md"
            variant="light"
          >
            <Text size="sm" lh={1.6}>
              • <strong>Fones de ouvido</strong>: Utilize fones para perceber melhor as nuances de dinâmica e afinação do seu naipe.
              <br />
              • <strong>Ajuste de velocidade</strong>: Para passagens rápidas, reduza para 0.75x até memorizar a letra e respiração.
              <br />
              • <strong>Repetição</strong>: Ative o botão de repetição para treinar exaustivamente o trecho sem precisar reiniciar manualmente.
            </Text>
          </Alert>
        )}
      </Container>
    </Box>
  );
}
