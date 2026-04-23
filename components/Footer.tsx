"use client";

import { useEffect, useRef } from "react";

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = wrap.getBoundingClientRect();
    const w = r.width;
    const h = r.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const spacing = 20;
    let raf = 0;
    let phase = 0;
    let last = 0;

    const draw = (now: number) => {
      // throttle to ~20fps
      if (now - last < 50) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;
      phase += 0.015;

      ctx.clearRect(0, 0, w, h);
      for (let y = 0; y < h; y += spacing) {
        for (let x = 0; x < w; x += spacing) {
          const dy = y / h;
          const fade = Math.max(0, 1 - dy * 1.2);
          const flicker =
            0.12 + 0.12 * Math.sin(phase + x * 0.008 + y * 0.008) * fade;
          ctx.fillStyle = `rgba(255,255,255,${flicker * fade})`;
          ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <footer
      ref={wrapRef}
      className="relative h-[60svh] w-full overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <p className="font-display text-center text-3xl font-medium leading-tight tracking-tight text-white/90 md:text-5xl">
          Enjoy the beauty
          <br />
          of design.
        </p>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-6 md:px-10">
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
          VOID — MMXXV
        </span>
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
          ∅
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,8,0.4) 0%, rgba(0,0,0,0.95) 85%)",
        }}
      />
    </footer>
  );
}
