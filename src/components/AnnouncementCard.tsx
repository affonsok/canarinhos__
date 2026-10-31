import { Card, Text, Group, Badge, ThemeIcon, Stack } from "@mantine/core";
import { IconCalendar, IconMapPin, IconBell } from "@tabler/icons-react";
import type { Announcement } from "./types";

export function AnnouncementCard({
  announcement,
}: {
  announcement: Announcement;
}) {
  const hasEvent = Boolean(announcement.eventDate);

  return (
    <Card
      withBorder
      shadow="xs"
      padding="lg"
      radius="md"
      style={{
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Group justify="space-between" align="flex-start" mb="xs">
          <ThemeIcon size={34} radius="md" color="canarinhosBlue" variant="light">
            <IconBell size={18} />
          </ThemeIcon>
          {hasEvent && (
            <Badge
              color="canarinhosGold"
              variant="light"
              size="sm"
              leftSection={<IconCalendar size={12} />}
              style={{ color: "#856412" }}
            >
              {new Date(announcement.eventDate!).toLocaleDateString("pt-BR")}
            </Badge>
          )}
        </Group>

        <Text fw={700} size="md" c="canarinhosBlue.7" mb="xs">
          {announcement.title}
        </Text>

        <Text size="sm" c="dark.6" lh={1.6}>
          {announcement.content}
        </Text>
      </div>

      {announcement.location && (
        <Group gap={6} mt="md">
          <IconMapPin size={14} color="#64748b" />
          <Text size="xs" c="dimmed">
            {announcement.location}
          </Text>
        </Group>
      )}
    </Card>
  );
}
