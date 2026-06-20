import { useRef, useState } from 'react';

interface Props {
  onEnter: () => void;
  onDone: () => void;
}

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
const FS = 16;
const RAIN_MS = 1000;
const FADE_MS = 500;

function runDissolve(canvas: HTMLCanvasElement, onComplete: () => void) {
  const ctx = canvas.getContext('2d')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cols = Math.floor(canvas.width / FS);
  // Stagger drop starts so rain doesn't begin all at once
  const drops: number[] = Array.from({ length: cols }, () => Math.random() * -30);

  const start = performance.now();

  const tick = () => {
    const elapsed = performance.now() - start;

    // Dark wash per frame — creates trailing fade on characters
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${FS}px monospace`;

    drops.forEach((y, i) => {
      if (y < 0) { drops[i] += 0.6; return; }
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      // Head of drop is bright white-green, tail fades to dark green
      const isHead = drops[i] < 1 || Math.random() > 0.9;
      ctx.fillStyle = isHead ? '#ccffcc' : `hsl(120,100%,${18 + Math.random() * 22}%)`;
      ctx.fillText(char, i * FS, y * FS);

      drops[i] += 0.7 + Math.random() * 0.5;
      if (drops[i] * FS > canvas.height) drops[i] = Math.random() * -15;
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
  const [dissolving, setDissolving] = useState(false);
  const [fading, setFading] = useState(false);

  const handle = () => {
    if (dissolving) return;
    onEnter(); // synchronous — unlocks iOS audio here
    setDissolving(true);

    runDissolve(canvasRef.current!, () => {
      setFading(true);
      setTimeout(onDone, FADE_MS);
    });
  };

  return (
    <div
      onClick={handle}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm cursor-pointer select-none transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Matrix rain canvas — fades in when dissolving */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 transition-opacity duration-150 ${dissolving ? 'opacity-100' : 'opacity-0'}`}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Splash content — fades out when dissolving */}
      <div className={`relative z-10 flex flex-col items-center gap-2 mb-20 transition-opacity duration-200 ${dissolving ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-6xl mb-4">🏆</div>
        <div
          className="text-6xl font-black tracking-tight text-green-400"
          style={{ textShadow: '0 0 30px rgba(74,222,128,0.7), 0 0 60px rgba(74,222,128,0.3)' }}
        >
          TORNEO
        </div>
        <div
          className="text-3xl font-bold tracking-[0.4em] text-green-300"
          style={{ textShadow: '0 0 20px rgba(134,239,172,0.5)' }}
        >
          ALAN
        </div>
      </div>

      <div className={`relative z-10 animate-pulse text-green-500 text-xs tracking-[0.35em] uppercase transition-opacity duration-200 ${dissolving ? 'opacity-0' : 'opacity-100'}`}>
        tap para entrar
      </div>
    </div>
  );
}
