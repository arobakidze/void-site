"use client";

import { useEffect, useRef } from "react";

export default function TextReveal({
  text,
  sub,
}: {
  text: string;
  sub?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        const words = wordsRef.current.filter(Boolean);

        gsap.set(words, { opacity: 0.08, y: 20, filter: "blur(4px)" });

        gsap.to(words, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        });
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, []);

  const wordList = text.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[60vh] w-full items-center justify-center bg-void-bg px-6 py-32 md:min-h-[70vh] md:px-10"
    >
      <div className="mx-auto max-w-5xl text-center">
        {sub && (
          <span className="font-body mb-6 block text-xs uppercase tracking-[0.4em] text-white/30">
            {sub}
          </span>
        )}
        <p className="font-display text-4xl font-medium leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl">
          {wordList.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className="mr-[0.3em] inline-block will-change-[transform,opacity,filter]"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
