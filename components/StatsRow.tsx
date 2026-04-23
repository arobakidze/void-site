"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: string; label: string; target?: number };

const stats: Stat[] = [
  { value: "∞", label: "Possibilities" },
  { value: "100%", label: "Craft", target: 100 },
  { value: "60", label: "FPS Smooth", target: 60 },
  { value: "1", label: "Vision", target: 1 },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function CountUp({
  to,
  suffix = "",
  duration = 1800,
  start,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  start: boolean;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, start]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

export default function StatsRow() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="relative w-full bg-void-bg py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="h-px w-full bg-white/10" />

        <div
          ref={ref}
          className="grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4 md:gap-y-0"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-start px-4 md:border-r md:border-white/5 md:last:border-r-0"
            >
              <span className="font-display text-5xl font-semibold leading-none text-white md:text-6xl lg:text-7xl">
                {s.value === "∞" ? (
                  "∞"
                ) : s.value === "100%" ? (
                  <CountUp to={s.target ?? 0} suffix="%" start={inView} />
                ) : (
                  <CountUp to={s.target ?? 0} start={inView} />
                )}
              </span>
              <span className="mt-4 font-body text-xs uppercase tracking-[0.3em] text-white/40">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-white/10" />
      </div>
    </section>
  );
}
