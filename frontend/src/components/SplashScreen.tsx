import { useRef, useState } from 'react';

interface Props {
  onEnter: () => void;
  onDone: () => void;
}

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
const FS = 16;
const DURATION = 2200;

function runDissolve(canvas: HTMLCanvasElement, onComplete: () => void) {
  const ctx = canvas.getContext('2d')!;
  const W = canvas.width = window.innerWidth;
  const H = canvas.height = window.innerHeight;

  const cols = Math.floor(W / FS);
  const rows = Math.floor(H / FS);

  // Each column: head position (row units), speed, and per-cell chars
  const heads = Array.from({ length: cols }, () => -(Math.random() * rows * 0.6));
  const speeds = Array.from({ length: cols }, () => 0.35 + Math.random() * 0.45);
  const grid: string[][] = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => CHARS[Math.floor(Math.random() * CHARS.length)])
  );

  const start = performance.now();

  const tick = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / DURATION, 1);

    // Transparent canvas — no fill — so video/app shows through the gaps
    ctx.clearRect(0, 0, W, H);
    ctx.font = `bold ${FS}px monospace`;

    // Randomise some chars each frame for the "flickering" feel
    heads.forEach((_, col) => {
      if (Math.random() > 0.88) {
        const r = Math.floor(Math.random() * rows);
        grid[col][r] = CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    });

    heads.forEach((head, col) => {
      const x = col * FS;
      const trailLen = 7 + Math.floor(progress * 8);

      for (let t = 0; t <= trailLen; t++) {
        const row = Math.floor(head) - t;
        if (row < 0 || row >= rows) continue;

        const alpha = t === 0 ? 1 : (1 - t / trailLen) * 0.9;
        const green = t === 0 ? 255 : Math.floor(60 + (1 - t / trailLen) * 140);
        ctx.fillStyle = t === 0
          ? `rgba(210,255,210,${alpha})`
          : `rgba(0,${green},0,${alpha})`;

        ctx.fillText(grid[col][row], x, row * FS + FS);
      }

      // Speed up as progress increases so rain fills fast at the end
      heads[col] += speeds[col] * (1 + progress * 2);
      if (heads[col] > rows + trailLen + 5) {
        heads[col] = -(Math.random() * rows * 0.2);
        speeds[col] = 0.4 + Math.random() * 0.4;
      }
    });

    if (elapsed < DURATION) {
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

  const handle = () => {
    if (tapped) return;
    setTapped(true);
    onEnter(); // synchronous — iOS audio unlock
    runDissolve(canvasRef.current!, onDone);
  };

  return (
    <div onClick={handle} className="fixed inset-0 z-50 cursor-pointer select-none overflow-hidden">

      {/* Dark overlay — fades out over the same duration as the rain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0,0,0,0.65)',
          opacity: tapped ? 0 : 1,
          transition: tapped ? `opacity ${DURATION}ms ease-in` : 'none',
        }}
      />

      {/* Rain canvas — transparent bg so video/app shows through gaps */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Splash content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: tapped ? 0 : 1,
          transition: tapped ? 'opacity 250ms ease-out' : 'none',
        }}
      >
        <div className="flex flex-col items-center mb-20">
          <div className="text-6xl mb-5">🏆</div>
          <div
            className="text-6xl font-black tracking-tight leading-none text-green-400"
            style={{ textShadow: '0 0 30px rgba(74,222,128,0.75), 0 0 60px rgba(74,222,128,0.35)' }}
          >
            THE CHOSEN
          </div>
          <div
            className="text-6xl font-black tracking-tight leading-none text-green-400 mb-2"
            style={{ textShadow: '0 0 30px rgba(74,222,128,0.75), 0 0 60px rgba(74,222,128,0.35)' }}
          >
            ONE
          </div>
          <div className="text-xs text-green-500/60 tracking-[0.35em] uppercase mt-1">
            puntos de torneo
          </div>
        </div>

        <div className="animate-pulse text-green-500/80 text-xs tracking-[0.4em] uppercase">
          tap para entrar
        </div>
      </div>
    </div>
  );
}
