"use client";

export default function GravityCard() {
  const orbCount = 24;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#08080c]">
      {/* Center mass */}
      <div
        className="absolute h-5 w-5 rounded-full bg-white"
        style={{
          boxShadow:
            "0 0 20px rgba(255,255,255,0.8), 0 0 60px rgba(139,92,246,0.5), 0 0 100px rgba(34,211,238,0.2)",
        }}
      />

      {/* Orbit rings */}
      {[60, 100, 140].map((r, i) => (
        <div
          key={`ring-${i}`}
          className="absolute rounded-full"
          style={{
            width: r * 2,
            height: r * 2,
            border: `1px solid rgba(255,255,255,${0.04 + i * 0.01})`,
          }}
        />
      ))}

      {/* Orbiting particles */}
      {Array.from({ length: orbCount }, (_, i) => {
        const orbitIndex = i % 3;
        const radius = [60, 100, 140][orbitIndex];
        // Spread particles evenly per orbit, offset per orbit layer
        const perOrbit = Math.ceil(orbCount / 3);
        const indexInOrbit = Math.floor(i / 3);
        const startAngle = (indexInOrbit / perOrbit) * 360;
        // Each orbit has different speed and direction
        const duration = [8, 13, 20][orbitIndex];
        const reverse = orbitIndex === 1;
        const size = [3, 4, 2.5][orbitIndex];
        const colors = ["#8B5CF6", "#22D3EE", "#FB7185"];
        const color = colors[orbitIndex];

        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: radius * 2,
              height: radius * 2,
              animation: `spin-slow ${duration}s linear infinite${reverse ? " reverse" : ""}`,
              transform: `rotate(${startAngle}deg)`,
            }}
          >
            {/* The particle sits at the top of the spinning container */}
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: size,
                height: size,
                background: color,
                boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}60`,
              }}
            />
          </div>
        );
      })}

      {/* Center glow */}
      <div
        className="pointer-events-none absolute h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
