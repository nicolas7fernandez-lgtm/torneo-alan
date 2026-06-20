import { useRef, useState } from 'react';

interface Props {
  onEnter: () => void;
  onDone: () => void;
}

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
const FS = 16;
const RAIN_MS = 2200;
const FADE_MS = 350;

function runDissolve(canvas: HTMLCanvasElement, onComplete: () => void) {
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width = window.innerWidth;
  const H = canvas.height = window.innerHeight;

  ctx.clearRect(0, 0, W, H);

  const cols = Math.floor(W / FS);
  const rows = Math.floor(H / FS);

  const heads = Array.from({ length: cols }, () => -(Math.random() * rows * 0.55));
  const speeds = Array.from({ length: cols }, () => 0.3 + Math.random() * 0.45);
  const grid: string[][] = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  );

  const start = performance.now();

  const tick = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / RAIN_MS, 1);

    ctx.fillStyle = `rgba(0,3,0,${0.04 + progress * 0.09})`;
    ctx.fillRect(0, 0, W, H);

    ctx.font = `bold ${FS}px monospace`;

    for (let i = 0; i < cols; i++) {
      if (Math.random() > 0.87) {
        grid[i][Math.floor(Math.random() * rows)] = CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }

    heads.forEach((head, col) => {
      const x = col * FS;
      const trailLen = 5 + Math.floor(progress * 12);

      for (let t = 0; t <= trailLen; t++) {
        const row = Math.floor(head) - t;
        if (row < 0 || row >= rows) continue;
        const alpha = t === 0 ? 1 : Math.max(0, (1 - t / trailLen) * 0.88);
        const g = t === 0 ? 255 : Math.floor(45 + (1 - t / trailLen) * 160);
        ctx.fillStyle = t === 0 ? `rgba(200,255,200,${alpha})` : `rgba(0,${g},0,${alpha})`;
        ctx.fillText(grid[col][row], x, row * FS + FS);
      }

      heads[col] += speeds[col] * (1 + progress * 2.8);
      if (heads[col] > rows + trailLen + 5) {
        const stagger = Math.max(0, 0.45 - progress * 0.5);
        heads[col] = -(Math.random() * rows * stagger);
        speeds[col] = 0.3 + Math.random() * 0.5;
      }
    });

    if (elapsed < RAIN_MS) {
      requestAnimationFrame(tick);
    } else {
      onComplete();
    }
  };

  requestAnimationFrame(tick);
}

export default function SplashScreen({ onEnter, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tapped, setTapped] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const handle = () => {
    if (tapped) return;
    setTapped(true);
    onEnter();
    runDissolve(canvasRef.current!, () => {
      setFadingOut(true);
      setTimeout(onDone, FADE_MS);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none bg-black"
      style={{
        opacity: fadingOut ? 0 : 1,
        transition: fadingOut ? `opacity ${FADE_MS}ms ease-out` : 'none',
        pointerEvents: fadingOut ? 'none' : 'auto',
      }}
      onClick={handle}
    >
      {/* Video — bg-black on wrapper guarantees no flash while video loads */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/The Matrix Code thing Render - CrystalPanda (720p) (1).mp4"
      />

      {/* Subtle tint so text is readable against the rain video */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Rain canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-8"
        style={{
          opacity: tapped ? 0 : 1,
          transition: tapped ? 'opacity 180ms ease-out' : 'none',
        }}
      >
        {/* Title */}
        <div className="flex flex-col items-center text-center gap-3">
          <img
            src="/stickman.gif"
            alt=""
            className="w-64 h-auto drop-shadow-[0_0_12px_rgba(74,222,128,0.4)]"
          />
          <div
            className="text-5xl font-black tracking-wide leading-none text-green-400"
            style={{ textShadow: '0 0 25px rgba(74,222,128,0.85), 0 0 60px rgba(74,222,128,0.4)' }}
          >
            THE CHOSEN
          </div>
          <div
            className="text-5xl font-black tracking-wide leading-none text-green-400"
            style={{ textShadow: '0 0 25px rgba(74,222,128,0.85), 0 0 60px rgba(74,222,128,0.4)' }}
          >
            ONE
          </div>

          {/* Subtitle pill */}
          <div className="mt-2 px-4 py-1.5 rounded-full border border-green-500/60 bg-green-950/70 text-green-300 text-xs font-semibold tracking-[0.3em] uppercase">
            Puntos de torneo
          </div>
        </div>

        {/* Tap button */}
        <div className="px-8 py-3 rounded-2xl border border-green-400/70 bg-green-950/60 text-green-300 text-sm font-bold tracking-[0.3em] uppercase animate-pulse">
          Tap para entrar
        </div>
      </div>
    </div>
  );
}
