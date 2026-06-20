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

    // Try immediate autoplay (works on desktop / Android Chrome)
    audio.play().catch(() => {});

    // iOS Safari requires the play() call to be SYNCHRONOUS inside a user event.
    // We listen at capture phase so we beat every other handler on the page.
    const unlock = () => {
      audio.play();            // intentionally no .catch — must be sync
    };

    const EVENTS = ['touchstart', 'touchend', 'pointerdown', 'mousedown'] as const;
    EVENTS.forEach(e => document.addEventListener(e, unlock, { capture: true, once: true }));

    return () => {
      audio.pause();
      audio.src = '';
      EVENTS.forEach(e => document.removeEventListener(e, unlock, true));
    };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    if (!next) audioRef.current.play().catch(() => {});
    setMuted(next);
  };

  return { muted, toggle };
}
