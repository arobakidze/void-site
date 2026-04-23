"use client";

import { useMemo } from "react";

export default function TypoSpiral() {
  const items = useMemo(() => {
    const arr: {
      angle: number;
      radius: number;
      scale: number;
      opacity: number;
    }[] = [];
    const N = 100;
    for (let i = 0; i < N; i++) {
      const t = i / N;
      arr.push({
        angle: i * 22,
        radius: (1 - t) * 44,
        scale: 0.15 + (1 - t) * 3,
        opacity: 0.05 + (1 - t) * 0.95,
      });
    }
    return arr;
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-void-bg">
      <div className="relative h-full w-full">
        {items.map((it, i) => (
          <span
            key={i}
            className="font-display absolute left-1/2 top-1/2 select-none font-semibold uppercase tracking-[-0.05em] text-white"
            style={{
              transform: `translate(-50%, -50%) rotate(${it.angle}deg) translateY(-${it.radius}vmin) scale(${it.scale})`,
              opacity: it.opacity,
              fontSize: "3vmin",
              textShadow: "0 0 20px rgba(139,92,246,0.5)",
              mixBlendMode: "screen",
            }}
          >
            EXIST
          </span>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.95) 100%)",
        }}
      />
    </div>
  );
}
