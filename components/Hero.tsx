"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Preloader from "./Preloader";

/* ---- Three.js elements ---- */

function Starfield({ count = 6000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = 0.5 + Math.random() * 1.5;
    return arr;
  }, [count]);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#c4b5fd"),
      new THREE.Color("#8B5CF6"),
      new THREE.Color("#22D3EE"),
      new THREE.Color("#FB7185"),
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      const dim = 0.3 + Math.random() * 0.7;
      arr[i * 3] = c.r * dim;
      arr[i * 3 + 1] = c.g * dim;
      arr[i * 3 + 2] = c.b * dim;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.008;
      ref.current.rotation.x += delta * 0.003;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Icosahedron() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.x += delta * 0.12;
    group.current.rotation.y += delta * 0.2;
    const t = state.clock.elapsedTime;
    group.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.03);
  });

  return (
    <group ref={group}>
      {/* Primary wireframe */}
      <mesh>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial wireframe color="#8B5CF6" transparent opacity={0.85} />
      </mesh>
      {/* Ghost shell */}
      <mesh>
        <icosahedronGeometry args={[2.63, 1]} />
        <meshBasicMaterial wireframe color="#22D3EE" transparent opacity={0.12} />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <icosahedronGeometry args={[3.2, 0]} />
        <meshBasicMaterial wireframe color="#8B5CF6" transparent opacity={0.04} />
      </mesh>
      <pointLight color="#8B5CF6" intensity={1.5} distance={12} decay={2} />
      <pointLight color="#22D3EE" intensity={0.5} distance={8} decay={2} position={[3, 2, 0]} />
    </group>
  );
}

function Parallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / size.width - 0.5) * 2;
      target.current.y = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  useFrame(() => {
    if (!group.current) return;
    group.current.position.x += (target.current.x * 1.0 - group.current.position.x) * 0.04;
    group.current.position.y += (-target.current.y * 0.6 - group.current.position.y) * 0.04;
  });

  return <group ref={group}>{children}</group>;
}

/* ---- DOM overlay ---- */

function HeroTitle({ show }: { show: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    (async () => {
      const Splitting = (await import("splitting")).default;
      if (cancelled || !ref.current) return;
      const results = Splitting({ target: ref.current, by: "chars" });
      const chars = results[0]?.chars ?? [];
      chars.forEach((char, i) => {
        const el = char as HTMLElement;
        const dx = (Math.random() - 0.5) * 600;
        const dy = (Math.random() - 0.5) * 600;
        const rot = (Math.random() - 0.5) * 90;
        el.style.display = "inline-block";
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(0.3)`;
        el.style.opacity = "0";
        el.style.filter = "blur(10px)";
        el.style.transition = `transform 1.6s cubic-bezier(0.22, 1, 0.36, 1),
          opacity 1.4s ease,
          filter 1.6s ease`;
        el.style.transitionDelay = `${0.3 + i * 0.08}s`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transform = "translate(0,0) rotate(0) scale(1)";
            el.style.opacity = "1";
            el.style.filter = "blur(0px)";
          });
        });
      });
    })();
    return () => { cancelled = true; };
  }, [show]);

  return (
    <h1
      ref={ref}
      className="font-display text-[22vw] leading-[0.82] font-bold tracking-[-0.05em] md:text-[18vw] lg:text-[14vw]"
      style={{
        background: "linear-gradient(180deg, #ffffff 10%, rgba(255,255,255,0.3) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        visibility: show ? "visible" : "hidden",
      }}
    >
      VOID
    </h1>
  );
}

function Typewriter({ text, active, delay = 600 }: { text: string; active: boolean; delay?: number }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!active) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    let tick: ReturnType<typeof setInterval>;
    timer = setTimeout(() => {
      tick = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(tick);
      }, 35);
    }, delay);
    return () => {
      clearTimeout(timer);
      clearInterval(tick);
    };
  }, [text, delay, active]);

  return (
    <p className="font-body text-base tracking-wide text-white/60 md:text-lg">
      {shown}
      {active && <span className="caret h-[1em] align-middle" />}
    </p>
  );
}

/* ---- Main Hero ---- */

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const onPreloaderComplete = useCallback(() => {
    setLoaded(true);
    setTimeout(() => setNavVisible(true), 400);
  }, []);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-void-bg">
      {/* Preloader */}
      {!loaded && <Preloader onComplete={onPreloaderComplete} />}

      {/* 3D canvas */}
      <div className="absolute inset-0">
        {!isMobile ? (
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 9], fov: 55 }}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
            }}
            performance={{ min: 0.5 }}
          >
            <color attach="background" args={["#050508"]} />
            <fog attach="fog" args={["#050508", 12, 80]} />
            <Parallax>
              <Starfield count={5000} />
              <Icosahedron />
            </Parallax>
          </Canvas>
        ) : (
          <MobileStars />
        )}
      </div>

      {/* Center glow rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="absolute h-[50vmin] w-[50vmin] rounded-full"
          style={{
            border: "1px solid rgba(139,92,246,0.15)",
            boxShadow: "0 0 100px 20px rgba(139,92,246,0.06)",
            animation: loaded ? "spin-slow 120s linear infinite" : "none",
            opacity: loaded ? 1 : 0,
            transition: "opacity 2s ease 0.5s",
          }}
        />
        <div
          className="absolute h-[70vmin] w-[70vmin] rounded-full"
          style={{
            border: "1px solid rgba(34,211,238,0.08)",
            boxShadow: "0 0 60px 10px rgba(34,211,238,0.03)",
            animation: loaded ? "spin-slow 180s linear infinite reverse" : "none",
            opacity: loaded ? 1 : 0,
            transition: "opacity 2s ease 0.8s",
          }}
        />
      </div>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,0.85) 100%)",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10">
        {/* Nav */}
        <nav
          className="flex items-center justify-between"
          style={{
            opacity: navVisible ? 1 : 0,
            transform: navVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 1s ease, transform 1s ease",
          }}
        >
          <span className="font-display text-sm tracking-[0.3em] text-white/80">
            VOID
          </span>
          <div className="flex gap-10">
            {["Work", "About", "Process"].map((item, i) => (
              <span
                key={item}
                className="font-body hidden text-xs tracking-[0.2em] text-white/40 md:block"
                style={{
                  opacity: navVisible ? 1 : 0,
                  transform: navVisible ? "translateY(0)" : "translateY(-10px)",
                  transition: `opacity 0.8s ease ${0.6 + i * 0.1}s, transform 0.8s ease ${0.6 + i * 0.1}s`,
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <span className="font-body text-xs tracking-[0.3em] text-white/40">
            MMXXV
          </span>
        </nav>

        {/* Title */}
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <HeroTitle show={loaded} />
            <div
              className="mx-auto mt-6 max-w-lg"
              style={{
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 1.2s ease 1.5s, transform 1.2s ease 1.5s",
              }}
            >
              <Typewriter
                text="Design is the silent language of wonder"
                active={loaded}
                delay={1800}
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex items-end justify-between gap-8"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1.4s ease 1s, transform 1.4s ease 1s",
          }}
        >
          <div className="flex gap-12">
            <div>
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/30">
                Craft
              </span>
              <p className="font-body mt-1 text-sm text-white/60">Pixel-perfect</p>
            </div>
            <div>
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/30">
                Feeling
              </span>
              <p className="font-body mt-1 text-sm text-white/60">Unforgettable</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Scroll
            </span>
            <div className="h-12 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
            <div className="scroll-indicator-dot h-1.5 w-1.5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileStars() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(1.5px 1.5px at 20% 30%, #fff, transparent 50%),
          radial-gradient(1px 1px at 80% 60%, #8B5CF6, transparent 50%),
          radial-gradient(1px 1px at 40% 70%, #22D3EE, transparent 50%),
          radial-gradient(1px 1px at 60% 20%, #fff, transparent 50%),
          radial-gradient(2px 2px at 90% 90%, #FB7185, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 50%),
          #050508`,
        backgroundSize:
          "400px 400px, 500px 500px, 300px 300px, 600px 600px, 700px 700px, 100% 100%, 100% 100%",
      }}
    />
  );
}
