"use client";

import { useRef, useState } from "react";

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
  const loggedRef = useRef(false);

  function handlePlay() {
    setPlaying(true);
    if (materialId && !loggedRef.current) {
      loggedRef.current = true;
      fetch("/api/practice-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      }).catch(() => {});
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setPlaying(false));
    }
    setPlaying(!playing);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <p className="mb-4 text-base font-semibold text-slate-900">{title}</p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-canarinhos-blue text-white shadow transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-canarinhos-gold"
          aria-label={playing ? "Pausar" : "Reproduzir"}
        >
          {playing ? (
            <span className="text-xl">❚❚</span>
          ) : (
            <span className="ml-0.5 text-xl">▶</span>
          )}
        </button>
        <audio
          ref={audioRef}
          src={src}
          controls
          className="h-10 w-full"
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={handlePlay}
        />
      </div>
    </div>
  );
}
