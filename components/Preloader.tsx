"use client";

import { useEffect, useState } from "react";

export default function Preloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 2200;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / duration);
      // ease out expo
      const eased = 1 - Math.pow(1 - p, 4);
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setPhase("exit");
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 800);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void-bg"
      style={{
        clipPath: phase === "exit" ? "inset(0 0 0 100%)" : "inset(0 0 0 0)",
        transition:
          phase === "exit"
            ? "clip-path 0.8s cubic-bezier(0.76, 0, 0.24, 1)"
            : "none",
      }}
    >
      {/* Center content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Small glow */}
        <div
          className="absolute -inset-40 opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
          }}
        />

        <span
          className="font-display text-sm tracking-[0.5em] text-white/50"
          style={{
            animation: "preloader-text-in 2.4s ease forwards",
          }}
        >
          EXPERIENCE THE
        </span>

        <h1
          className="font-display text-[20vw] font-bold leading-[0.8] tracking-[-0.04em] md:text-[14vw]"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.25) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "preloader-text-in 2.8s ease forwards",
          }}
        >
          VOID
        </h1>

        {/* Progress bar */}
        <div className="mt-4 h-px w-48 overflow-hidden bg-white/10">
          <div
            className="h-full origin-left bg-gradient-to-r from-void-violet to-void-cyan"
            style={{
              transform: `scaleX(${progress / 100})`,
              transition: "transform 0.1s linear",
            }}
          />
        </div>

        <span className="font-body text-xs tabular-nums tracking-[0.2em] text-white/40">
          {progress}%
        </span>
      </div>
    </div>
  );
}
