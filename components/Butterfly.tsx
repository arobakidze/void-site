"use client";

/**
 * Production-quality SVG butterfly.
 *
 * Structure:
 *  - Root group: gentle floating bob via CSS transform
 *  - Left wing group (transform-origin: right edge → body hinge)
 *      - Upper forewing  (larger, with iridescent gradient + vein pattern)
 *      - Lower hindwing  (smaller, slight phase offset in flap)
 *  - Right wing group (mirrored, transform-origin: left edge)
 *  - Body (thorax + abdomen ellipses)
 *  - Antennae (curved paths)
 *  - Sparkle particles (pure CSS, position: absolute)
 *
 * Only transform + opacity are animated → composited on GPU, 60 fps.
 */

interface ButterflyProps {
  size?: number;
  speed?: number;
  wingColor?: "violet" | "cyan" | "rose" | "gold";
  loop?: boolean;
  className?: string;
}

const PALETTES = {
  violet: {
    upper1: "#c4b5fd",
    upper2: "#8B5CF6",
    upper3: "#5b21b6",
    lower1: "#a78bfa",
    lower2: "#7c3aed",
    accent: "#ddd6fe",
    body: "#6d28d9",
    glow: "rgba(139,92,246,0.35)",
  },
  cyan: {
    upper1: "#a5f3fc",
    upper2: "#22D3EE",
    upper3: "#0e7490",
    lower1: "#67e8f9",
    lower2: "#06b6d4",
    accent: "#cffafe",
    body: "#0891b2",
    glow: "rgba(34,211,238,0.35)",
  },
  rose: {
    upper1: "#fecdd3",
    upper2: "#FB7185",
    upper3: "#be123c",
    lower1: "#fda4af",
    lower2: "#f43f5e",
    accent: "#ffe4e6",
    body: "#e11d48",
    glow: "rgba(251,113,133,0.35)",
  },
  gold: {
    upper1: "#fef3c7",
    upper2: "#f59e0b",
    upper3: "#92400e",
    lower1: "#fde68a",
    lower2: "#d97706",
    accent: "#fffbeb",
    body: "#b45309",
    glow: "rgba(245,158,11,0.35)",
  },
};

export default function Butterfly({
  size = 280,
  speed = 1,
  wingColor = "violet",
  loop = true,
  className = "",
}: ButterflyProps) {
  const pal = PALETTES[wingColor];
  const dur = 1.6 / speed;
  const id = `bf-${wingColor}`;

  return (
    <div
      className={`bf-root relative inline-block ${className}`}
      style={{
        width: size,
        height: size,
        // gentle floating drift
        animation: loop
          ? `bf-float ${3.6 / speed}s ease-in-out infinite`
          : "none",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated butterfly"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Iridescent gradients */}
          <radialGradient id={`${id}-uw`} cx="30%" cy="35%" r="75%">
            <stop offset="0%" stopColor={pal.accent} stopOpacity="0.9" />
            <stop offset="35%" stopColor={pal.upper1} stopOpacity="0.85" />
            <stop offset="70%" stopColor={pal.upper2} stopOpacity="0.8" />
            <stop offset="100%" stopColor={pal.upper3} stopOpacity="0.6" />
          </radialGradient>
          <radialGradient id={`${id}-lw`} cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor={pal.accent} stopOpacity="0.7" />
            <stop offset="40%" stopColor={pal.lower1} stopOpacity="0.75" />
            <stop offset="100%" stopColor={pal.lower2} stopOpacity="0.5" />
          </radialGradient>
          {/* Glow filter */}
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Shimmer highlight */}
          <linearGradient id={`${id}-shim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* === LEFT WING GROUP === */}
        <g
          style={{
            transformOrigin: "100px 100px",
            animation: `bf-flap-l ${dur}s cubic-bezier(0.37, 0, 0.63, 1) infinite`,
          }}
        >
          {/* Upper forewing */}
          <path
            d="M100 82 C80 30, 25 15, 18 55 C12 85, 35 110, 100 100 Z"
            fill={`url(#${id}-uw)`}
            filter={`url(#${id}-glow)`}
            opacity="0.92"
          />
          {/* Shimmer layer on upper */}
          <path
            d="M100 82 C80 30, 25 15, 18 55 C12 85, 35 110, 100 100 Z"
            fill={`url(#${id}-shim)`}
            opacity="0.5"
          />
          {/* Vein lines */}
          <path d="M98 88 C75 60, 50 42, 30 55" stroke={pal.upper3} strokeWidth="0.4" opacity="0.35" />
          <path d="M98 92 C70 75, 42 68, 25 72" stroke={pal.upper3} strokeWidth="0.3" opacity="0.25" />
          <path d="M98 96 C72 90, 50 88, 38 92" stroke={pal.upper3} strokeWidth="0.3" opacity="0.2" />
          {/* Eyespot */}
          <circle cx="52" cy="60" r="7" fill={pal.upper3} opacity="0.3" />
          <circle cx="52" cy="60" r="4" fill={pal.accent} opacity="0.5" />
          <circle cx="52" cy="60" r="1.5" fill="#fff" opacity="0.8" />

          {/* Lower hindwing — slight phase offset via separate animation */}
          <g style={{
            transformOrigin: "100px 100px",
            animation: `bf-flap-lower ${dur}s cubic-bezier(0.37, 0, 0.63, 1) ${dur * 0.08}s infinite`,
          }}>
            <path
              d="M100 100 C60 105, 22 120, 30 155 C38 175, 70 168, 100 120 Z"
              fill={`url(#${id}-lw)`}
              filter={`url(#${id}-glow)`}
              opacity="0.85"
            />
            <path
              d="M100 100 C60 105, 22 120, 30 155 C38 175, 70 168, 100 120 Z"
              fill={`url(#${id}-shim)`}
              opacity="0.35"
            />
            {/* Hindwing eyespot */}
            <circle cx="55" cy="138" r="5" fill={pal.lower2} opacity="0.3" />
            <circle cx="55" cy="138" r="2.5" fill={pal.accent} opacity="0.45" />
          </g>
        </g>

        {/* === RIGHT WING GROUP (mirrored) === */}
        <g
          style={{
            transformOrigin: "100px 100px",
            animation: `bf-flap-r ${dur}s cubic-bezier(0.37, 0, 0.63, 1) infinite`,
          }}
        >
          {/* Upper forewing */}
          <path
            d="M100 82 C120 30, 175 15, 182 55 C188 85, 165 110, 100 100 Z"
            fill={`url(#${id}-uw)`}
            filter={`url(#${id}-glow)`}
            opacity="0.92"
          />
          <path
            d="M100 82 C120 30, 175 15, 182 55 C188 85, 165 110, 100 100 Z"
            fill={`url(#${id}-shim)`}
            opacity="0.5"
          />
          <path d="M102 88 C125 60, 150 42, 170 55" stroke={pal.upper3} strokeWidth="0.4" opacity="0.35" />
          <path d="M102 92 C130 75, 158 68, 175 72" stroke={pal.upper3} strokeWidth="0.3" opacity="0.25" />
          <path d="M102 96 C128 90, 150 88, 162 92" stroke={pal.upper3} strokeWidth="0.3" opacity="0.2" />
          <circle cx="148" cy="60" r="7" fill={pal.upper3} opacity="0.3" />
          <circle cx="148" cy="60" r="4" fill={pal.accent} opacity="0.5" />
          <circle cx="148" cy="60" r="1.5" fill="#fff" opacity="0.8" />

          {/* Lower hindwing */}
          <g style={{
            transformOrigin: "100px 100px",
            animation: `bf-flap-lower ${dur}s cubic-bezier(0.37, 0, 0.63, 1) ${dur * 0.08}s infinite`,
          }}>
            <path
              d="M100 100 C140 105, 178 120, 170 155 C162 175, 130 168, 100 120 Z"
              fill={`url(#${id}-lw)`}
              filter={`url(#${id}-glow)`}
              opacity="0.85"
            />
            <path
              d="M100 100 C140 105, 178 120, 170 155 C162 175, 130 168, 100 120 Z"
              fill={`url(#${id}-shim)`}
              opacity="0.35"
            />
            <circle cx="145" cy="138" r="5" fill={pal.lower2} opacity="0.3" />
            <circle cx="145" cy="138" r="2.5" fill={pal.accent} opacity="0.45" />
          </g>
        </g>

        {/* === BODY === */}
        <g>
          {/* Thorax */}
          <ellipse
            cx="100" cy="92" rx="3.5" ry="10"
            fill={pal.body}
            stroke={pal.accent}
            strokeWidth="0.3"
            opacity="0.95"
          />
          {/* Abdomen */}
          <ellipse
            cx="100" cy="112" rx="2.5" ry="12"
            fill={pal.body}
            opacity="0.85"
          />
          {/* Head */}
          <circle cx="100" cy="80" r="3.5" fill={pal.body} opacity="0.9" />
          {/* Eyes */}
          <circle cx="98" cy="79" r="1" fill={pal.accent} opacity="0.8" />
          <circle cx="102" cy="79" r="1" fill={pal.accent} opacity="0.8" />
          {/* Body highlight */}
          <ellipse cx="100" cy="92" rx="1.5" ry="8" fill="#fff" opacity="0.15" />
        </g>

        {/* === ANTENNAE === */}
        <g style={{
          animation: `bf-bob ${dur * 1.5}s ease-in-out infinite`,
          transformOrigin: "100px 80px",
        }}>
          <path
            d="M98 78 C90 55, 75 48, 68 42"
            stroke={pal.body}
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <circle cx="68" cy="42" r="1.5" fill={pal.accent} opacity="0.8" />
          <path
            d="M102 78 C110 55, 125 48, 132 42"
            stroke={pal.body}
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <circle cx="132" cy="42" r="1.5" fill={pal.accent} opacity="0.8" />
        </g>
      </svg>

      {/* Sparkle particles — pure CSS, no JS */}
      {Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const dist = 35 + (i % 3) * 18;
        const x = 50 + Math.cos(angle) * dist;
        const y = 50 + Math.sin(angle) * dist;
        const delay = i * 0.35;
        const particleSize = 1.5 + (i % 3) * 0.8;
        const colors = [pal.accent, pal.upper1, "#fff", pal.lower1];

        return (
          <div
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{
              width: particleSize,
              height: particleSize,
              background: colors[i % colors.length],
              left: `${x}%`,
              top: `${y}%`,
              animation: `bf-sparkle ${2.5 + (i % 3)}s ease-in-out ${delay}s infinite`,
              boxShadow: `0 0 ${particleSize * 3}px ${colors[i % colors.length]}`,
            }}
          />
        );
      })}
    </div>
  );
}
