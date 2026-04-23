"use client";

import { useEffect, useRef, useState } from "react";
import GravityCard from "./cards/GravityCard";
import LightCard from "./cards/LightCard";
import TimeCard from "./cards/TimeCard";

export default function FeatureCards() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-void-bg py-32 md:py-48">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="font-body text-xs uppercase tracking-[0.3em] text-white/40">
              Chapter 01
            </span>
            <h2 className="font-display mt-3 text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
              The Pillars
            </h2>
          </div>
          <p className="hidden max-w-xs font-body text-sm text-white/50 md:block">
            Three principles at the heart of everything we craft.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {[
            { index: "01", title: "Gravity", el: <GravityCard /> },
            { index: "02", title: "Bloom", el: <LightCard /> },
            { index: "03", title: "Time", el: <TimeCard /> },
          ].map((card, i) => (
            <div
              key={card.index}
              className="glass relative overflow-hidden rounded-2xl p-6 md:p-7 transition-all duration-1000 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(80px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {card.index}
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
                  //
                </span>
              </div>
              <div className="relative mt-6 h-[320px] w-full overflow-hidden rounded-xl bg-[#08080c]">
                {card.el}
              </div>
              <h3 className="font-display mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
