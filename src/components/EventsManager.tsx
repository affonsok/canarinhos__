"use client";

import { useState } from "react";
import Link from "next/link";
import {
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
  Divider,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarEvent,
  IconMapPin,
  IconPlus,
  IconClock,
  IconEdit,
  IconTrash,
  IconPlayerPlay,
  IconFileText,
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
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

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

  function handleOpenCreate() {
    setEditingEvent(null);
    setTitle("");
    setEventDate("");
    setLocation("");
    setDescription("");
    setSelectedMaterialIds([]);
    setError(null);
    open();
  }

  function handleOpenEdit(evt: EventItem) {
    setEditingEvent(evt);
    setTitle(evt.title);
    // Formata a data para datetime-local (YYYY-MM-DDTHH:mm)
    try {
      const d = new Date(evt.eventDate);
      const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEventDate(isoLocal);
    } catch {
      setEventDate(evt.eventDate);
    }
    setLocation(evt.location || "");
    setDescription(evt.description || "");
    setSelectedMaterialIds(evt.materials.map((m) => m.id));
    setError(null);
    open();
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !eventDate) {
      setError("Por favor, preencha o título e a data do evento.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isEdit = Boolean(editingEvent);
      const method = isEdit ? "PUT" : "POST";
      const payload: Record<string, unknown> = {
        title,
        description,
        eventDate,
        location,
        materialIds: selectedMaterialIds,
      };

      if (isEdit) {
        payload.id = editingEvent!.id;
      }

      const res = await fetch("/api/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao salvar compromisso");
      }

      const data = await res.json();
      if (data.ok && data.event) {
        if (isEdit) {
          setEvents((prev) =>
            prev.map((item) => (item.id === data.event.id ? data.event : item))
          );
        } else {
          setEvents((prev) => [...prev, data.event]);
        }
        close();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao registrar compromisso.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!window.confirm("Tem certeza que deseja apagar este compromisso da agenda?")) {
      return;
    }

    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao apagar evento");
      }

      setEvents((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Falha ao apagar evento.";
      alert(msg);
    }
  }

  return (
    <Stack gap="xl">
      {/* Barra de Ação Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div>
          <Title order={3} fw={800} c="dark.8" className="text-base sm:text-lg">
            Agenda de Compromissos & Apresentações
          </Title>
          <Text size="xs" c="dimmed" mt={2}>
            Painel exclusivo do regente para criar, alterar e apagar compromissos do coral.
          </Text>
        </div>

        <Button
          onClick={handleOpenCreate}
          color="canarinhosBlue"
          leftSection={<IconPlus size={16} />}
          radius="md"
          className="bg-[#0c1e38] hover:bg-[#162c4a] shadow-xs self-start sm:self-auto min-h-[44px]"
        >
          Novo Compromisso
        </Button>
      </div>

      {/* Lista de Eventos */}
      {events.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/90 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <IconCalendarEvent size={24} />
          </div>
          <Text fw={700} size="sm" c="dark.7">
            Nenhum compromisso agendado
          </Text>
          <Text size="xs" c="dimmed" mt={4}>
            Clique no botão acima para adicionar um novo compromisso com as músicas marcadas.
          </Text>
        </div>
      ) : (
        <Stack gap="md">
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
                padding="lg"
                radius="md"
                bg="white"
                className="rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all"
              >
                <Stack gap="sm">
                  {/* Topo do Card com Data, Local e Botões Editar / Excluir */}
                  <Group justify="space-between" align="flex-start" wrap="wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge
                          color="yellow.7"
                          variant="filled"
                          size="md"
                          style={{ color: "#1e3a5f", textTransform: "capitalize" }}
                        >
                          {dateFormatted} às {timeFormatted}
                        </Badge>

                        {evt.location && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                            <IconMapPin size={13} className="text-[#1e3a5f]" />
                            <span>{evt.location}</span>
                          </div>
                        )}
                      </div>

                      <Title order={3} fw={800} c="canarinhosBlue.7" className="text-base sm:text-lg">
                        {evt.title}
                      </Title>
                    </div>

                    <Group gap="xs">
                      <Tooltip label="Editar este compromisso">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          radius="md"
                          onClick={() => handleOpenEdit(evt)}
                          aria-label="Editar compromisso"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Apagar este compromisso">
                        <ActionIcon
                          variant="light"
                          color="red"
                          size="lg"
                          radius="md"
                          onClick={() => handleDeleteEvent(evt.id)}
                          aria-label="Apagar compromisso"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Repertório Convocado ({evt.materials?.length || 0} faixas):
                      </span>
                    </div>

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
                            size="md"
                            radius="md"
                            leftSection={
                              m.type === "score" ? (
                                <IconFileText size={12} />
                              ) : (
                                <IconPlayerPlay size={12} />
                              )
                            }
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

      {/* Modal de Criação / Edição de Evento */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap="xs">
            <IconCalendarEvent size={20} color="#1e3a5f" />
            <Text fw={700} size="md">
              {editingEvent ? "Alterar Compromisso do Coral" : "Novo Compromisso do Coral"}
            </Text>
          </Group>
        }
        size="lg"
        radius="md"
      >
        <form onSubmit={handleSaveEvent}>
          <Stack gap="md">
            {error && (
              <Text size="sm" c="red" fw={600}>
                {error}
              </Text>
            )}

            <TextInput
              label="Título do Compromisso"
              placeholder="Ex: Missa Solene de Maio / Ensaio Geral"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <TextInput
              label="Data e Horário"
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />

            <TextInput
              label="Local da Apresentação / Ensaio"
              placeholder="Ex: Paróquia São Sebastião - Centro"
              leftSection={<IconMapPin size={16} />}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Textarea
              label="Orientações e Traje"
              placeholder="Ex: Chegar com 30min de antecedência para aquecimento vocal. Traje oficial de gala."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
            />

            <MultiSelect
              label="Músicas do Repertório a Cantar"
              placeholder="Selecione as músicas e partituras deste evento"
              data={materialOptions}
              value={selectedMaterialIds}
              onChange={setSelectedMaterialIds}
              searchable
              clearable
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="canarinhosBlue"
                loading={loading}
                className="bg-[#0c1e38] hover:bg-[#162c4a]"
              >
                {editingEvent ? "Salvar Alterações" : "Criar Compromisso"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
