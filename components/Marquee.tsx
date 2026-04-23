"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["DESIGN", "CODE", "MOTION", "SPACE", "VOID", "ART"];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [reverse, setReverse] = useState(false);
  const [weight, setWeight] = useState(500);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // map 0..1500 -> 400..800
      const w = Math.min(800, 400 + (y / 1500) * 400);
      setWeight(Math.round(w));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = Array.from({ length: 4 }).flatMap(() => WORDS);

  return (
    <section
      className="relative w-full overflow-hidden border-t border-b border-white/5 bg-void-bg py-10"
      onMouseEnter={() => setReverse(true)}
      onMouseLeave={() => setReverse(false)}
    >
      <div
        ref={trackRef}
        className={`flex w-max whitespace-nowrap ${
          reverse ? "animate-scroll-x-reverse" : "animate-scroll-x"
        }`}
        style={{ willChange: "transform" }}
      >
        {[...items, ...items].map((word, i) => (
          <span
            key={i}
            className="font-display px-10 text-[7vw] uppercase leading-none tracking-[-0.03em] text-white/90"
            style={{
              fontWeight: weight,
              transition: "font-weight 0.3s ease",
            }}
          >
            {word}
            <span className="mx-8 text-void-violet">·</span>
          </span>
        ))}
      </div>
    </section>
  );
}
