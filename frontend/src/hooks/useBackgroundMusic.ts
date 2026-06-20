import { useEffect, useRef, useState } from 'react';

export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Works immediately on desktop / Android Chrome
    audio.play().catch(() => {});

    return () => { audio.pause(); audio.src = ''; };
  }, [src]);

  // Called synchronously inside user gesture (splash tap) — unlocks iOS audio
  const start = () => {
    audioRef.current?.play().catch(() => {});
  };

  const toggle = () => {
    if (!audioRef.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    if (!next) audioRef.current.play().catch(() => {});
    setMuted(next);
  };

  return { muted, toggle, start };
}
