"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Constellation from "./panels/Constellation";
import BlackHole from "./panels/BlackHole";
import TypoSpiral from "./panels/TypoSpiral";

const MorphingBlob = dynamic(() => import("./panels/MorphingBlob"), { ssr: false });
const DotFabric = dynamic(() => import("./panels/DotFabric"), { ssr: false });

export default function HorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!trackRef.current || !sectionRef.current) return;

      ctx = gsap.context(() => {
        const track = trackRef.current!;
        const section = sectionRef.current!;

        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
          },
        });

        const panels = gsap.utils.toArray<HTMLElement>(".h-panel");
        panels.forEach((panel) => {
          const reveal = panel.querySelector(".reveal");
          if (!reveal) return;
          gsap.fromTo(
            reveal,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 80%",
                end: "left 40%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, []);

  const panels: { label: string; title: string; el: React.ReactNode }[] = [
    { label: "I", title: "Constellation", el: <Constellation /> },
    { label: "II", title: "Morph", el: <MorphingBlob /> },
    { label: "III", title: "Fabric", el: <DotFabric /> },
    { label: "IV", title: "Event Horizon", el: <BlackHole /> },
    { label: "V", title: "Exist", el: <TypoSpiral /> },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-void-bg"
    >
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${100 * 5}vw` }}
      >
        {panels.map((p, i) => (
          <div
            key={i}
            className="h-panel relative flex h-full w-[100vw] shrink-0 items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0">{p.el}</div>
            <div className="reveal pointer-events-none absolute bottom-10 left-10 z-10">
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
                Panel {p.label}
              </span>
              <h3 className="font-display mt-2 text-5xl font-semibold md:text-7xl">
                {p.title}
              </h3>
            </div>
            <span className="absolute right-10 top-10 font-body text-[10px] uppercase tracking-[0.3em] text-white/40">
              0{i + 1} / 05
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
