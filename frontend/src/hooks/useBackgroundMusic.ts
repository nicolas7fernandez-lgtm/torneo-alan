import { useEffect, useRef, useState } from 'react';

export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Attempt immediate autoplay
    const startPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked — attach to the very next user gesture
        const resume = () => {
          audio.play().catch(() => {});
          document.removeEventListener('touchstart', resume, true);
          document.removeEventListener('mousedown', resume, true);
          document.removeEventListener('keydown', resume, true);
        };
        document.addEventListener('touchstart', resume, { capture: true, once: true });
        document.addEventListener('mousedown', resume, { capture: true, once: true });
        document.addEventListener('keydown', resume, { capture: true, once: true });
      });
    };

    // Small delay lets the browser settle before the first play attempt
    const t = setTimeout(startPlay, 100);

    return () => {
      clearTimeout(t);
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    // Also try playing in case it hasn't started yet
    if (!next) audioRef.current.play().catch(() => {});
    setMuted(next);
  };

  return { muted, toggle };
}
