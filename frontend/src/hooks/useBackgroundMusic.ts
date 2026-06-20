import { useEffect, useRef, useState } from 'react';

export function useBackgroundMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const tryPlay = () => {
      if (playedRef.current) return;
      audio.play().then(() => { playedRef.current = true; }).catch(() => {});
    };

    tryPlay();

    // iOS Safari requires a user gesture — catch the first tap
    const onGesture = () => tryPlay();
    document.addEventListener('touchstart', onGesture, { once: true });
    document.addEventListener('click', onGesture, { once: true });

    return () => {
      audio.pause();
      audio.src = '';
      document.removeEventListener('touchstart', onGesture);
      document.removeEventListener('click', onGesture);
    };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    const next = !muted;
    audioRef.current.muted = next;
    setMuted(next);
    // If first interaction on iOS didn't trigger play yet, start now
    if (!playedRef.current) {
      audioRef.current.play().then(() => { playedRef.current = true; }).catch(() => {});
    }
  };

  return { muted, toggle };
}
