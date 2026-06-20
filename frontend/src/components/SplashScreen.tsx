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

  // Start fully transparent — video shows through
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

    // Dark green wash accumulates each frame — this is what "eats" the video
    // Gets heavier as progress increases so the screen fills by the end
    ctx.fillStyle = `rgba(0,3,0,${0.04 + progress * 0.09})`;
    ctx.fillRect(0, 0, W, H);

    ctx.font = `bold ${FS}px monospace`;

    // Flicker random chars
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

      // Rain speeds up over time so the screen fills completely by the end
      heads[col] += speeds[col] * (1 + progress * 2.8);
      if (heads[col] > rows + trailLen + 5) {
        // As progress approaches 1, drops reset with less stagger so all columns are active
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
    onEnter(); // synchronous — iOS audio unlock

    runDissolve(canvasRef.current!, () => {
      // Rain finished — now quickly fade the whole splash to reveal the app
      setFadingOut(true);
      setTimeout(onDone, FADE_MS);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer select-none"
      style={{
        opacity: fadingOut ? 0 : 1,
        transition: fadingOut ? `opacity ${FADE_MS}ms ease-out` : 'none',
        pointerEvents: fadingOut ? 'none' : 'auto',
      }}
      onClick={handle}
    >
      {/* Splash has its own video so no app content bleeds through */}
      <video
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/The Matrix Code thing Render - CrystalPanda (720p) (1).mp4"
      />

      {/* Fixed dark tint so title is readable — does NOT change during animation */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Rain canvas — paints on top of the video, consuming it */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Title — vanishes instantly on tap so rain takes over */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-10"
        style={{
          opacity: tapped ? 0 : 1,
          transition: tapped ? 'opacity 180ms ease-out' : 'none',
        }}
      >
        <div className="flex flex-col items-center text-center mb-20">
          <div className="text-5xl mb-5">🏆</div>
          <div
            className="text-4xl font-black tracking-wide text-green-400 leading-tight"
            style={{ textShadow: '0 0 25px rgba(74,222,128,0.8), 0 0 55px rgba(74,222,128,0.4)' }}
          >
            THE CHOSEN ONE
          </div>
          <div className="text-xs text-green-500/55 tracking-[0.35em] uppercase mt-3">
            puntos de torneo
          </div>
        </div>

        <div className="animate-pulse text-green-500/65 text-xs tracking-[0.4em] uppercase">
          tap para entrar
        </div>
      </div>
    </div>
  );
}
