"use client";

import { useEffect, useRef } from "react";

export default function BlackHole() {
  const ringRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      if (ringRef.current) {
        ringRef.current.style.transform = `rotate(${t * 40}deg)`;
      }
      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateX(72deg) rotateZ(${t * 30}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative flex h-full w-full items-center justify-center bg-void-bg"
      style={{ perspective: "1600px" }}
    >
      {/* Lensing haze */}
      <div
        className="absolute h-[90vmin] w-[90vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.25) 10%, transparent 55%)",
          filter: "blur(40px)",
        }}
      />

      {/* Tilted accretion disk */}
      <div
        ref={tiltRef}
        className="relative h-[70vmin] w-[70vmin]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(251,113,133,0.9), rgba(139,92,246,0.9), rgba(34,211,238,0.9), rgba(251,113,133,0.9))",
            filter: "blur(2px)",
            mask: "radial-gradient(closest-side, transparent 58%, black 60%, black 92%, transparent 94%)",
            WebkitMask:
              "radial-gradient(closest-side, transparent 58%, black 60%, black 92%, transparent 94%)",
          }}
        />
        {/* glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "0 0 80px rgba(139,92,246,0.5), inset 0 0 40px rgba(34,211,238,0.3)",
          }}
        />
      </div>

      {/* Event horizon */}
      <div
        className="absolute h-[28vmin] w-[28vmin] rounded-full"
        style={{
          background:
            "radial-gradient(circle, #000 55%, rgba(0,0,0,0.85) 70%, transparent 100%)",
          boxShadow:
            "0 0 80px 10px rgba(0,0,0,0.9), 0 0 120px 40px rgba(139,92,246,0.15)",
        }}
      />

      {/* Photon ring */}
      <div
        ref={ringRef}
        className="absolute h-[34vmin] w-[34vmin] rounded-full"
        style={{
          border: "1px solid rgba(255,255,255,0.6)",
          boxShadow:
            "0 0 30px rgba(255,255,255,0.3), inset 0 0 30px rgba(255,255,255,0.2)",
        }}
      />

      {/* Halftone */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.55) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
