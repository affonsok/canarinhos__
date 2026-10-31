"use client";

import { useState } from "react";
import {
  Paper,
  Title,
  Text,
  Group,
  Table,
  Badge,
  Button,
  Modal,
  TextInput,
  PasswordInput,
  Select,
  Stack,
  ActionIcon,
  ThemeIcon,
  Tooltip,
  Alert,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconUserPlus,
  IconUser,
  IconEdit,
  IconTrash,
  IconSearch,
  IconAlertCircle,
  IconCheck,
  IconKey,
  IconMicrophone,
} from "@tabler/icons-react";

export interface StudentItem {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  voicePart: string;
  role: string;
  createdAt: string;
  totalSessions: number;
}

const voiceColors: Record<string, string> = {
  soprano: "pink",
  contralto: "grape",
  tenor: "cyan",
  baixo: "indigo",
  baritono: "teal",
  todos: "green",
};

function generateSuggestedUsername(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function StudentsManager({
  initialStudents,
}: {
  initialStudents: StudentItem[];
}) {
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [search, setSearch] = useState("");

  // Modal de Criação
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("123456");
  const [newVoicePart, setNewVoicePart] = useState<string>("soprano");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Modal de Edição
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editVoicePart, setEditVoicePart] = useState<string>("soprano");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Modal de Confirmação de Exclusão
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deletingStudent, setDeletingStudent] = useState<StudentItem | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Mensagem de sucesso
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleNameChange(val: string) {
    setNewName(val);
    setNewUsername(generateSuggestedUsername(val));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          username: newUsername,
          password: newPassword,
          voicePart: newVoicePart,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar aluno");
      }

      setStudents((prev) => [...prev, data.student]);
      setSuccessMessage(
        `Aluno '${data.student.name}' cadastrado com sucesso! Login: ${data.student.username}`
      );
      closeCreate();
      setNewName("");
      setNewUsername("");
      setNewPassword("123456");
      setNewVoicePart("soprano");
    } catch (err: any) {
      setCreateError(err.message || "Erro inesperado.");
    } finally {
      setCreateLoading(false);
    }
  }

  function startEdit(s: StudentItem) {
    setEditingStudent(s);
    setEditName(s.name);
    setEditUsername(s.username);
    setEditVoicePart(s.voicePart.toLowerCase());
    setEditPassword("");
    setEditError(null);
    openEdit();
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingStudent) return;
    setEditLoading(true);
    setEditError(null);

    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStudent.id,
          name: editName,
          username: editUsername,
          voicePart: editVoicePart,
          password: editPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar alterações");
      }

      setStudents((prev) =>
        prev.map((item) =>
          item.id === editingStudent.id
            ? {
                ...item,
                name: data.student.name,
                username: data.student.username,
                voicePart: data.student.voicePart,
              }
            : item
        )
      );

      setSuccessMessage(`Dados de '${data.student.name}' atualizados.`);
      closeEdit();
    } catch (err: any) {
      setEditError(err.message || "Erro ao atualizar.");
    } finally {
      setEditLoading(false);
    }
  }

  function startDelete(s: StudentItem) {
    setDeletingStudent(s);
    openDelete();
  }

  async function handleDelete() {
    if (!deletingStudent) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/students?id=${deletingStudent.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir aluno");
      }

      setStudents((prev) => prev.filter((item) => item.id !== deletingStudent.id));
      setSuccessMessage(`Aluno '${deletingStudent.name}' removido.`);
      closeDelete();
    } catch (err: any) {
      alert(err.message || "Falha ao excluir");
    } finally {
      setDeleteLoading(false);
    }
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.username.toLowerCase().includes(q) ||
      s.voicePart.toLowerCase().includes(q)
    );
  });

  return (
    <Stack gap="lg">
      {/* Feedback de sucesso */}
      {successMessage && (
        <Alert
          icon={<IconCheck size={16} />}
          color="teal"
          radius="md"
          withCloseButton
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      {/* Top Bar com Busca e Botão Novo Aluno */}
      <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <TextInput
            placeholder="Buscar por nome, login ou naipe..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            radius="md"
            style={{ flex: 1, minWidth: 260 }}
          />

          <Button
            onClick={openCreate}
            color="canarinhosBlue"
            leftSection={<IconUserPlus size={16} />}
            radius="md"
          >
            Cadastrar Novo Aluno
          </Button>
        </Group>
      </Paper>

      {/* Tabela de Alunos */}
      <Paper withBorder radius="md" bg="white" shadow="xs" style={{ overflow: "hidden" }}>
        <Box p="md" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <Group justify="space-between">
            <Text fw={700} size="md" c="dark.8">
              Lista de Cantores Cadastrados
            </Text>
            <Badge color="canarinhosBlue" variant="light">
              {filtered.length} aluno(s)
            </Badge>
          </Group>
        </Box>

        <Table verticalSpacing="sm" horizontalSpacing="md" striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Cantor(a)</Table.Th>
              <Table.Th>Login de Acesso</Table.Th>
              <Table.Th>Naipe</Table.Th>
              <Table.Th style={{ textAlign: "center" }}>Ensaios</Table.Th>
              <Table.Th style={{ textAlign: "right" }}>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: "center", padding: "30px" }}>
                  <Text c="dimmed" size="sm">
                    Nenhum aluno encontrado para a busca informada.
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered.map((s) => (
                <Table.Tr key={s.id}>
                  <Table.Td>
                    <Group gap="xs">
                      <ThemeIcon size={28} radius="xl" color="canarinhosBlue" variant="light">
                        <IconUser size={15} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600} size="sm" c="dark.8">
                          {s.name}
                        </Text>
                        {s.role === "admin" && (
                          <Badge size="xs" color="yellow.7" variant="filled">
                            Regência / Admin
                          </Badge>
                        )}
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="gray.8" variant="dot" size="md">
                      {s.username}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      size="sm"
                      variant="light"
                      color={voiceColors[s.voicePart.toLowerCase()] || "gray"}
                      style={{ textTransform: "capitalize" }}
                    >
                      {s.voicePart}
                    </Badge>
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    <Text size="sm" fw={600} c="dark.7">
                      {s.totalSessions}x
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ textAlign: "right" }}>
                    <Group gap={6} justify="flex-end">
                      <Tooltip label="Editar aluno">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => startEdit(s)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Excluir aluno">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => startDelete(s)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Modal de Criação de Aluno */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title={
          <Group gap="xs">
            <IconUserPlus size={20} color="#1e3a5f" />
            <Text fw={700} size="md">
              Cadastrar Novo Aluno do Coro
            </Text>
          </Group>
        }
        radius="md"
      >
        <form onSubmit={handleCreate}>
          <Stack gap="md">
            {createError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md">
                {createError}
              </Alert>
            )}

            <TextInput
              label="Nome Completo do Aluno"
              placeholder="Ex: Affonso Kopmann"
              required
              value={newName}
              onChange={(e) => handleNameChange(e.currentTarget.value)}
              radius="md"
            />

            <TextInput
              label="Login de Acesso"
              description="Gerado automaticamente: nome e sobrenome juntos (sem espaços)"
              placeholder="ex: affonsokopmann"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.currentTarget.value)}
              radius="md"
            />

            <PasswordInput
              label="Senha Inicial"
              description="Pode ser uma senha simples para o aluno (ex: 123456)"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.currentTarget.value)}
              radius="md"
            />

            <Select
              label="Naipe Vocal"
              value={newVoicePart}
              onChange={(val) => setNewVoicePart(val || "soprano")}
              data={[
                { value: "soprano", label: "Soprano" },
                { value: "contralto", label: "Contralto" },
                { value: "tenor", label: "Tenor" },
                { value: "baixo", label: "Baixo" },
                { value: "baritono", label: "Barítono" },
                { value: "todos", label: "Todos / Tutti" },
              ]}
              radius="md"
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeCreate} radius="md">
                Cancelar
              </Button>
              <Button
                type="submit"
                color="canarinhosBlue"
                loading={createLoading}
                radius="md"
                leftSection={<IconCheck size={16} />}
              >
                Cadastrar Aluno
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal de Edição de Aluno */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title={
          <Group gap="xs">
            <IconEdit size={20} color="#1e3a5f" />
            <Text fw={700} size="md">
              Editar Dados do Aluno
            </Text>
          </Group>
        }
        radius="md"
      >
        <form onSubmit={handleEdit}>
          <Stack gap="md">
            {editError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md">
                {editError}
              </Alert>
            )}

            <TextInput
              label="Nome Completo"
              required
              value={editName}
              onChange={(e) => setEditName(e.currentTarget.value)}
              radius="md"
            />

            <TextInput
              label="Login de Acesso"
              required
              value={editUsername}
              onChange={(e) => setEditUsername(e.currentTarget.value)}
              radius="md"
            />

            <Select
              label="Naipe Vocal"
              value={editVoicePart}
              onChange={(val) => setEditVoicePart(val || "soprano")}
              data={[
                { value: "soprano", label: "Soprano" },
                { value: "contralto", label: "Contralto" },
                { value: "tenor", label: "Tenor" },
                { value: "baixo", label: "Baixo" },
                { value: "baritono", label: "Barítono" },
                { value: "todos", label: "Todos / Tutti" },
              ]}
              radius="md"
            />

            <PasswordInput
              label="Redefinir Senha (opcional)"
              placeholder="Deixe em branco para manter a atual"
              value={editPassword}
              onChange={(e) => setEditPassword(e.currentTarget.value)}
              radius="md"
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeEdit} radius="md">
                Cancelar
              </Button>
              <Button
                type="submit"
                color="canarinhosBlue"
                loading={editLoading}
                radius="md"
                leftSection={<IconCheck size={16} />}
              >
                Salvar Alterações
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirmar Exclusão"
        radius="md"
        size="sm"
      >
        <Stack gap="md">
          <Text size="sm">
            Tem certeza de que deseja excluir o aluno{" "}
            <strong>{deletingStudent?.name}</strong> (login:{" "}
            <code>{deletingStudent?.username}</code>)?
          </Text>
          <Text size="xs" c="dimmed">
            O histórico de ensaios associado a este aluno também será removido.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelete} radius="md">
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={deleteLoading}
              radius="md"
            >
              Excluir Definitivamente
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
