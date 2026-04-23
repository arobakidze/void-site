"use client";

import { useEffect, useState } from "react";

export default function TimeCard() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 50);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div className="h-full w-full bg-[#08080c]" />;
  }

  const ms = now.getMilliseconds();
  const s = now.getSeconds() + ms / 1000;
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;

  const sAngle = (s / 60) * 360;
  const mAngle = (m / 60) * 360;
  const hAngle = (h / 12) * 360;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const label = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#08080c]">
      {/* Rings */}
      <Ring radius={140} color="rgba(255,255,255,0.08)" />
      <Ring radius={100} color="rgba(255,255,255,0.08)" />
      <Ring radius={60} color="rgba(255,255,255,0.08)" />

      {/* Seconds orb */}
      <OrbitOrb radius={140} angle={sAngle} color="#FB7185" size={6} />
      {/* Minutes orb */}
      <OrbitOrb radius={100} angle={mAngle} color="#22D3EE" size={8} />
      {/* Hours orb */}
      <OrbitOrb radius={60} angle={hAngle} color="#8B5CF6" size={10} />

      {/* Center */}
      <div
        className="absolute h-2 w-2 rounded-full bg-white"
        style={{ boxShadow: "0 0 20px rgba(255,255,255,0.8)" }}
      />

      {/* Label */}
      <div className="absolute bottom-3 left-3 font-body text-[10px] uppercase tracking-[0.3em] text-white/50">
        {label}
      </div>
      <div className="absolute right-3 top-3 font-body text-[10px] uppercase tracking-[0.3em] text-white/30">
        UTC{new Date().getTimezoneOffset() > 0 ? "-" : "+"}
        {Math.abs(new Date().getTimezoneOffset() / 60)}
      </div>
    </div>
  );
}

function Ring({ radius, color }: { radius: number; color: string }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: radius * 2,
        height: radius * 2,
        border: `1px dashed ${color}`,
      }}
    />
  );
}

function OrbitOrb({
  radius,
  angle,
  color,
  size,
}: {
  radius: number;
  angle: number;
  color: string;
  size: number;
}) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        transform: `translate(${x}px, ${y}px)`,
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}80`,
      }}
    />
  );
}
