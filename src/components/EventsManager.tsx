"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Paper,
  Title,
  Text,
  Group,
  Badge,
  Button,
  Modal,
  TextInput,
  Textarea,
  MultiSelect,
  Stack,
  Card,
  ThemeIcon,
  Box,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarEvent,
  IconMapPin,
  IconMusic,
  IconPlus,
  IconClock,
  IconCheck,
  IconHeadphones,
} from "@tabler/icons-react";
import type { Material } from "./types";

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  materials: {
    id: string;
    title: string;
    type: string;
    voicePart: string | null;
  }[];
}

export function EventsManager({
  initialEvents,
  allMaterials,
}: {
  initialEvents: EventItem[];
  allMaterials: Material[];
}) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [opened, { open, close }] = useDisclosure(false);

  // Campos do formulário
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Opções para o MultiSelect de músicas
  const materialOptions = allMaterials.map((m) => ({
    value: m.id,
    label: `${m.title} (${m.type === "score" ? "Partitura" : "Áudio"}${
      m.voicePart ? ` - ${m.voicePart}` : ""
    })`,
  }));

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !eventDate) {
      setError("Por favor, preencha o título e a data do evento.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          eventDate,
          location,
          materialIds: selectedMaterialIds,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar evento");
      }

      const data = await res.json();
      if (data.ok && data.event) {
        setEvents((prev) => [...prev, data.event]);
        // Reset form
        setTitle("");
        setEventDate("");
        setLocation("");
        setDescription("");
        setSelectedMaterialIds([]);
        close();
      }
    } catch (err: any) {
      setError(err.message || "Falha ao registrar compromisso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack gap="xl">
      {/* Barra de Ação Superior */}
      <Group justify="space-between" align="center">
        <div>
          <Title order={3} fw={800} c="dark.8">
            Compromissos & Apresentações do Coral
          </Title>
          <Text size="sm" c="dimmed">
            Consulte datas, locais e as músicas programadas para cada concerto ou missa
          </Text>
        </div>

        <Button
          onClick={open}
          color="canarinhosBlue"
          leftSection={<IconPlus size={16} />}
          radius="md"
        >
          Novo Compromisso
        </Button>
      </Group>

      {/* Lista de Eventos */}
      {events.length === 0 ? (
        <Paper withBorder p={40} radius="md" ta="center" bg="white">
          <ThemeIcon size={48} radius="xl" color="gray" variant="light" mb="md">
            <IconCalendarEvent size={24} />
          </ThemeIcon>
          <Text fw={600} size="md" c="dark.7">
            Nenhum compromisso agendado
          </Text>
          <Text size="sm" c="dimmed" mt={4}>
            Clique no botão acima para adicionar um novo evento com o repertório marcado.
          </Text>
        </Paper>
      ) : (
        <Stack gap="lg">
          {events.map((evt) => {
            const dateObj = new Date(evt.eventDate);
            const dateFormatted = dateObj.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });
            const timeFormatted = dateObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Card
                key={evt.id}
                withBorder
                shadow="xs"
                padding="lg"
                radius="md"
                bg="white"
                className="rounded-2xl border border-slate-200/90 shadow-2xs"
              >
                <Stack gap="sm">
                  {/* Topo do Card */}
                  <Group justify="space-between" align="flex-start" wrap="wrap">
                    <div>
                      <Badge
                        color="yellow.7"
                        variant="filled"
                        size="md"
                        mb={6}
                        style={{ color: "#1e3a5f", textTransform: "capitalize" }}
                      >
                        {dateFormatted} às {timeFormatted}
                      </Badge>
                      <Title order={3} fw={800} c="canarinhosBlue.7">
                        {evt.title}
                      </Title>
                    </div>

                    {evt.location && (
                      <Group gap={6} c="dimmed" style={{ backgroundColor: "#f1f5f9", padding: "6px 12px", borderRadius: "8px" }}>
                        <IconMapPin size={16} color="#1e3a5f" />
                        <Text size="xs" fw={600} c="dark.7">
                          {evt.location}
                        </Text>
                      </Group>
                    )}
                  </Group>

                  {/* Descrição / Orientações */}
                  {evt.description && (
                    <Text size="sm" c="dark.6" lh={1.6}>
                      {evt.description}
                    </Text>
                  )}

                  <Divider my="xs" />

                  {/* Repertório Marcado para o Evento */}
                  <div>
                    <Group gap="xs" mb="xs">
                      <ThemeIcon size={24} radius="sm" color="canarinhosGold" variant="light">
                        <IconMusic size={14} color="#856412" />
                      </ThemeIcon>
                      <Text fw={700} size="sm" c="canarinhosBlue.7">
                        Repertório Selecionado ({evt.materials?.length || 0} músicas):
                      </Text>
                    </Group>

                    {!evt.materials || evt.materials.length === 0 ? (
                      <Text size="xs" c="dimmed">
                        Nenhuma música associada a este evento ainda.
                      </Text>
                    ) : (
                      <Group gap="xs" wrap="wrap">
                        {evt.materials.map((m) => (
                          <Badge
                            key={m.id}
                            component={Link}
                            href={`/ensaios/material/${m.id}`}
                            variant="light"
                            color={m.type === "score" ? "orange" : "blue"}
                            size="lg"
                            radius="md"
                            leftSection={<IconHeadphones size={13} />}
                            style={{
                              cursor: "pointer",
                              textDecoration: "none",
                              textTransform: "none",
                            }}
                          >
                            {m.title} {m.voicePart ? `(${m.voicePart})` : ""}
                          </Badge>
                        ))}
                      </Group>
                    )}
                  </div>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Modal de Cadastro de Novo Evento */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <IconCalendarEvent size={20} color="#1e3a5f" />
            <Text fw={700} size="md">
              Adicionar Novo Compromisso do Coro
            </Text>
          </Group>
        }
        size="lg"
        radius="md"
      >
        <form onSubmit={handleCreateEvent}>
          <Stack gap="md">
            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}

            <TextInput
              label="Nome do Evento / Celebração"
              placeholder="Ex: Missa Solene de Maio, Concerto de Páscoa..."
              required
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              radius="md"
            />

            <Group grow>
              <TextInput
                label="Data e Hora"
                type="datetime-local"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.currentTarget.value)}
                radius="md"
              />

              <TextInput
                label="Local"
                placeholder="Ex: Igreja Matriz, Teatro Positivo..."
                value={location}
                onChange={(e) => setLocation(e.currentTarget.value)}
                radius="md"
              />
            </Group>

            <Textarea
              label="Instruções e Lembretes (Traje, Chegada)"
              placeholder="Ex: Chegar com 40 min de antecedência para aquecimento vocal. Traje de gala..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              radius="md"
              rows={3}
            />

            <MultiSelect
              label="Músicas que serão cantadas neste evento"
              placeholder="Selecione as músicas do repertório..."
              data={materialOptions}
              value={selectedMaterialIds}
              onChange={setSelectedMaterialIds}
              searchable
              clearable
              radius="md"
              nothingFoundMessage="Nenhuma música encontrada"
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close} radius="md">
                Cancelar
              </Button>
              <Button
                type="submit"
                color="canarinhosBlue"
                loading={loading}
                radius="md"
                leftSection={<IconCheck size={16} />}
              >
                Salvar Compromisso
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
