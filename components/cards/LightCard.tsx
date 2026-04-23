"use client";

export default function LightCard() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#08080c]">
      {/* Animated flower bloom — pure CSS */}
      <div className="flower-container relative h-48 w-48">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 360;
          const delay = i * 0.15;
          const isInner = i >= 6;
          const scale = isInner ? 0.6 : 1;
          const radius = isInner ? 20 : 40;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
              }}
            >
              <div
                className="petal rounded-full"
                style={{
                  width: `${24 * scale}px`,
                  height: `${48 * scale}px`,
                  background: isInner
                    ? "linear-gradient(180deg, #FB7185, #8B5CF6)"
                    : "linear-gradient(180deg, rgba(139,92,246,0.9), rgba(34,211,238,0.6))",
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  opacity: 0,
                  transform: "scale(0) rotate(0deg)",
                  animation: `bloom 2s ease-out ${delay}s forwards, sway 4s ease-in-out ${delay + 2}s infinite alternate`,
                  filter: "blur(0.5px)",
                  boxShadow: isInner
                    ? "0 0 15px rgba(251,113,133,0.4)"
                    : "0 0 15px rgba(139,92,246,0.3)",
                }}
              />
            </div>
          );
        })}
        {/* Center pistil */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 18,
            height: 18,
            background: "radial-gradient(circle, #fff, #FB7185)",
            boxShadow: "0 0 20px rgba(251,113,133,0.6), 0 0 40px rgba(139,92,246,0.3)",
            opacity: 0,
            animation: "bloom 1s ease-out 1.8s forwards",
          }}
        />
      </div>

      {/* Ambient particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={`p-${i}`}
          className="absolute rounded-full"
          style={{
            width: 2,
            height: 2,
            background: i % 2 === 0 ? "#8B5CF6" : "#FB7185",
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            opacity: 0,
            animation: `float-particle 6s ease-in-out ${i * 0.5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
