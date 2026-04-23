"use client";

import { useEffect, useRef, useState } from "react";
import Butterfly from "./Butterfly";

function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Showcase() {
  return (
    <div className="relative w-full bg-void-bg">
      <ButterflySection />
      <NebulaSection />
      <ConstellationSection />
      <TypoSection />
    </div>
  );
}

/* ───── BUTTERFLY ───── */
function ButterflySection() {
  const { ref, visible } = useReveal<HTMLElement>(0.15);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-40"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.08) 0%, transparent 60%)",
        }}
      />

      <span
        className="font-body mb-4 text-xs uppercase tracking-[0.4em] text-white/30 transition-all duration-1000"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
      >
        Study I
      </span>
      <h2
        className="font-display mb-16 text-center text-5xl font-semibold tracking-tight transition-all duration-1000 delay-100 md:text-7xl"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)" }}
      >
        Metamorphosis
      </h2>

      <div
        className="transition-all duration-[1.4s] ease-out delay-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.5) translateY(60px)",
        }}
      >
        <Butterfly size={340} speed={0.9} wingColor="violet" />
      </div>

      <p
        className="mt-16 max-w-md text-center font-body text-sm text-white/40 transition-all duration-1000 delay-700"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)" }}
      >
        Beauty lives in the details you almost miss —
        the gentle motion, the shifting light, the quiet elegance.
      </p>
    </section>
  );
}

/* ───── NEBULA ───── */
function NebulaSection() {
  const { ref, visible } = useReveal<HTMLElement>(0.2);

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.25) 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 70% 60%, rgba(34,211,238,0.2) 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(251,113,133,0.15) 0%, transparent 40%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 60% 30%, rgba(139,92,246,0.12) 0%, transparent 30%)",
          animation: "nebula-drift 12s ease-in-out infinite alternate",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(circle at 35% 65%, rgba(34,211,238,0.1) 0%, transparent 35%)",
          animation: "nebula-drift 15s ease-in-out infinite alternate-reverse",
        }} />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
        }}
      />

      <h2
        className="font-display relative z-10 text-center text-[12vw] font-semibold leading-[0.88] tracking-[-0.04em] text-white transition-all duration-[1.6s] ease-out md:text-[8vw]"
        style={{
          clipPath: visible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
          textShadow: "0 0 60px rgba(139,92,246,0.5), 0 0 120px rgba(34,211,238,0.2)",
        }}
      >
        BEYOND THE<br />OBSERVABLE
      </h2>

      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.9) 100%)",
      }} />
    </section>
  );
}

/* ───── CONSTELLATION ───── */
function ConstellationSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Pt = { x: number; y: number; vx: number; vy: number };
    const pts: Pt[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }));

    let raf = 0;
    const tick = () => {
      ctx.fillStyle = "rgba(5,5,8,0.3)";
      ctx.fillRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 18000) {
            ctx.strokeStyle = `rgba(139,92,246,${(1 - d2 / 18000) * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [inView]);

  return (
    <section className="relative w-full overflow-hidden bg-void-bg py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="font-body text-xs uppercase tracking-[0.4em] text-white/30">Study II</span>
            <h2 className="font-display mt-3 text-5xl font-semibold tracking-tight md:text-7xl">Connection</h2>
          </div>
          <p className="hidden max-w-xs font-body text-sm text-white/50 md:block">
            Great design connects. Every element finds its rhythm.
          </p>
        </div>
        <div
          ref={wrapRef}
          className="relative h-[50vh] w-full overflow-hidden rounded-2xl"
          style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 60px rgba(139,92,246,0.05)" }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />
        </div>
      </div>
    </section>
  );
}

/* ───── TYPOGRAPHY ───── */
function TypoSection() {
  const { ref, visible } = useReveal<HTMLElement>(0.2);

  const count = 40;
  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-void-bg"
    >
      <div className="relative h-[80vmin] w-[80vmin]">
        {Array.from({ length: count }, (_, i) => {
          const t = i / count;
          const angle = i * 25;
          const radius = (1 - t) * 40;
          const scale = 0.2 + (1 - t) * 2.5;
          const opacity = 0.05 + (1 - t) * 0.95;
          return (
            <span
              key={i}
              className="font-display absolute left-1/2 top-1/2 select-none font-semibold uppercase tracking-[-0.05em] text-white transition-all duration-700"
              style={{
                transform: visible
                  ? `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}vmin) scale(${scale})`
                  : `translate(-50%, -50%) rotate(${angle}deg) translateY(0) scale(0)`,
                opacity: visible ? opacity : 0,
                transitionDelay: `${i * 30}ms`,
                fontSize: "3vmin",
                textShadow: "0 0 20px rgba(139,92,246,0.5)",
              }}
            >
              EXIST
            </span>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.95) 100%)",
      }} />
      <div className="pointer-events-none absolute bottom-10 left-10">
        <span className="font-body text-xs uppercase tracking-[0.4em] text-white/30">Study III</span>
        <h3 className="font-display mt-2 text-3xl font-semibold md:text-5xl">Existence</h3>
      </div>
    </section>
  );
}
