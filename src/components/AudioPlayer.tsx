"use client";

import { useRef, useState, useEffect } from "react";
import {
  Paper,
  Text,
  Group,
  ActionIcon,
  Slider,
  Badge,
  Stack,
  Button,
  Box,
  Tooltip,
} from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconVolumeOff,
  IconRepeat,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  materialId,
}: {
  src: string;
  title: string;
  materialId?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loop, setLoop] = useState(false);
  const [practiceLogged, setPracticeLogged] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => {
        setPlaying(true);
        if (materialId && !practiceLogged) {
          setPracticeLogged(true);
          fetch("/api/practice-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ materialId }),
          }).catch(() => {});
        }
      }).catch(() => setPlaying(false));
    }
  }

  function handleSeek(val: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = val;
    setCurrentTime(val);
  }

  function handleVolumeChange(val: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = val;
    setVolume(val);
    setMuted(val === 0);
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      audio.volume = volume || 1;
      setMuted(false);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  }

  function changeSpeed(rate: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  }

  function toggleLoop() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = !loop;
    setLoop(!loop);
  }

  return (
    <Paper withBorder shadow="sm" radius="lg" p="xl" bg="white">
      <audio ref={audioRef} src={src} preload="metadata" />

      <Stack gap="lg">
        {/* Header do Player */}
        <Group justify="space-between" align="center">
          <div>
            <Text fw={700} size="lg" c="canarinhosBlue.7">
              {title}
            </Text>
            <Text size="xs" c="dimmed">
              Use os controles de velocidade para treinar trechos rápidos
            </Text>
          </div>

          {practiceLogged && (
            <Badge
              color="teal"
              variant="light"
              size="sm"
              leftSection={<IconCheck size={12} />}
            >
              Ensaio Registrado
            </Badge>
          )}
        </Group>

        {/* Barra de Progresso */}
        <div>
          <Slider
            value={currentTime}
            max={duration || 100}
            onChange={handleSeek}
            label={formatTime}
            color="canarinhosGold"
            size="md"
            styles={{
              thumb: { borderWidth: 2, borderColor: "#1e3a5f" },
            }}
          />
          <Group justify="space-between" mt={4}>
            <Text size="xs" c="dimmed" fw={500}>
              {formatTime(currentTime)}
            </Text>
            <Text size="xs" c="dimmed" fw={500}>
              {formatTime(duration)}
            </Text>
          </Group>
        </div>

        {/* Controles Principais */}
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          {/* Play/Pause e Repetir */}
          <Group gap="sm">
            <ActionIcon
              size={54}
              radius="xl"
              color="canarinhosBlue"
              variant="filled"
              onClick={togglePlay}
              style={{
                boxShadow: "0 4px 14px rgba(30, 58, 95, 0.35)",
              }}
              aria-label={playing ? "Pausar" : "Reproduzir"}
            >
              {playing ? (
                <IconPlayerPause size={26} />
              ) : (
                <IconPlayerPlay size={26} style={{ marginLeft: 3 }} />
              )}
            </ActionIcon>

            <Tooltip label={loop ? "Desativar repetição" : "Repetir continuamente"}>
              <ActionIcon
                size="lg"
                radius="md"
                variant={loop ? "filled" : "light"}
                color={loop ? "yellow.7" : "gray"}
                onClick={toggleLoop}
              >
                <IconRepeat size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>

          {/* Velocidade de reprodução para ensaio */}
          <Group gap={4}>
            <Text size="xs" fw={600} c="dimmed" mr={4}>
              Velocidade:
            </Text>
            {[0.75, 1, 1.25].map((rate) => (
              <Button
                key={rate}
                size="xs"
                radius="sm"
                variant={playbackRate === rate ? "filled" : "light"}
                color={playbackRate === rate ? "canarinhosBlue" : "gray"}
                onClick={() => changeSpeed(rate)}
                style={{ padding: "0 8px", height: "26px" }}
              >
                {rate}x
              </Button>
            ))}
          </Group>

          {/* Volume */}
          <Group gap="xs" style={{ width: 140 }}>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={toggleMute}
            >
              {muted || volume === 0 ? (
                <IconVolumeOff size={18} />
              ) : (
                <IconVolume size={18} />
              )}
            </ActionIcon>
            <Slider
              value={muted ? 0 : volume}
              max={1}
              step={0.05}
              onChange={handleVolumeChange}
              size="xs"
              color="canarinhosBlue"
              style={{ flex: 1 }}
              label={(val) => `${Math.round(val * 100)}%`}
            />
          </Group>
        </Group>
      </Stack>
    </Paper>
  );
}
