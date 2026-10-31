"use client";

import { useRef, useState, useEffect } from "react";
import { Slider, Tooltip } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconVolumeOff,
  IconRepeat,
  IconCheck,
  IconClock,
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
      audio
        .play()
        .then(() => {
          setPlaying(true);
          if (materialId && !practiceLogged) {
            setPracticeLogged(true);
            fetch("/api/practice-log", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ materialId }),
            }).catch(() => {});
          }
        })
        .catch(() => setPlaying(false));
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
    <div className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Topo do Player com Indicador de Registro */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            Console de Reprodução Vocal
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-tight">
            {title}
          </h3>
        </div>

        {practiceLogged ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Ensaio Computado no Ranking</span>
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-medium">
            Escute para computar no ranking
          </span>
        )}
      </div>

      {/* Barra de Progresso e Tempo */}
      <div className="mb-5">
        <Slider
          value={currentTime}
          max={duration || 100}
          onChange={handleSeek}
          label={formatTime}
          color="yellow.7"
          size="sm"
          styles={{
            thumb: { borderWidth: 2, borderColor: "#0c1e38" },
            bar: { backgroundColor: "#c9a227" },
          }}
        />
        <div className="flex items-center justify-between mt-1.5 text-xs font-semibold text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controles do Console Bento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Play/Pause e Loop */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-[#0c1e38] hover:bg-[#162c4a] text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
            aria-label={playing ? "Pausar áudio" : "Reproduzir áudio"}
          >
            {playing ? (
              <IconPlayerPause size={22} />
            ) : (
              <IconPlayerPlay size={22} className="ml-0.5 text-[#fde047]" />
            )}
          </button>

          <Tooltip label={loop ? "Desativar repetição" : "Repetir continuamente (Loop)"}>
            <button
              type="button"
              onClick={toggleLoop}
              className={`p-2.5 rounded-xl border transition-colors ${
                loop
                  ? "bg-[#c9a227] text-slate-950 border-[#c9a227] font-bold shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
              aria-label="Repetição contínua"
            >
              <IconRepeat size={18} />
            </button>
          </Tooltip>

          <div className="text-xs text-slate-500 font-medium pl-1">
            {playing ? "Tocando..." : "Pronto para ensaiar"}
          </div>
        </div>

        {/* Velocidade de Estudo (0.75x, 1x, 1.25x) */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 px-1">
            Velocidade:
          </span>
          {[0.75, 1, 1.25].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => changeSpeed(rate)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                playbackRate === rate
                  ? "bg-[#0c1e38] text-white shadow-2xs"
                  : "bg-transparent hover:bg-white text-slate-600"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 min-w-[130px]">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-400 hover:text-slate-700 transition-colors"
            aria-label={muted ? "Ativar som" : "Silenciar"}
          >
            {muted || volume === 0 ? (
              <IconVolumeOff size={18} />
            ) : (
              <IconVolume size={18} />
            )}
          </button>
          <div className="flex-1">
            <Slider
              value={muted ? 0 : volume}
              max={1}
              step={0.05}
              onChange={handleVolumeChange}
              size="xs"
              color="canarinhosBlue"
              label={(val) => `${Math.round(val * 100)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
