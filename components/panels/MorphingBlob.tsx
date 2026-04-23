"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function buildPoly(sides: number, seed: number, jitter: number) {
  const pts: [number, number][] = [];
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + seed;
    const r =
      220 +
      Math.sin(seed + i * 1.3) * 60 +
      ((seed * 31 + i * 97) % 50) * (jitter / 50);
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

function polyPath(pts: [number, number][]) {
  return (
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`
      )
      .join(" ") + " Z"
  );
}

export default function MorphingBlob() {
  const shapes = useMemo(
    () => [
      polyPath(buildPoly(7, 0.2, 20)),
      polyPath(buildPoly(5, 1.1, 40)),
      polyPath(buildPoly(9, 2.3, 10)),
      polyPath(buildPoly(6, 3.0, 60)),
      polyPath(buildPoly(8, 4.2, 30)),
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(
      () => setIdx((v) => (v + 1) % shapes.length),
      2400
    );
    return () => clearInterval(id);
  }, [shapes.length]);

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-void-bg">
      <div
        ref={containerRef}
        className="relative h-[70vmin] w-[70vmin]"
        style={{ animation: "spin-slow 60s linear infinite" }}
      >
        {shapes.map((d, i) => (
          <svg
            key={i}
            viewBox="-320 -320 640 640"
            className="absolute inset-0 h-full w-full"
            style={{
              opacity: idx === i ? 1 : 0,
              transition: "opacity 1.6s ease",
              filter: "drop-shadow(0 0 80px rgba(139,92,246,0.35))",
            }}
          >
            <defs>
              <radialGradient id={`g-${i}`} cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#FB7185" stopOpacity="0.9" />
                <stop offset="45%" stopColor="#8B5CF6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
              </radialGradient>
            </defs>
            <path d={d} fill={`url(#g-${i})`} />
            <path
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.7"
            />
          </svg>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
