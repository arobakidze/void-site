"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX - 5}px, ${mouseY - 5}px, 0)`;
    };

    const tick = () => {
      // spring lag
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnterLink = () => {
      ring.style.width = "60px";
      ring.style.height = "60px";
      ring.style.marginLeft = "-10px";
      ring.style.marginTop = "-10px";
      ring.style.borderColor = "rgba(34, 211, 238, 0.9)";
    };
    const onLeaveLink = () => {
      ring.style.width = "40px";
      ring.style.height = "40px";
      ring.style.marginLeft = "0px";
      ring.style.marginTop = "0px";
      ring.style.borderColor = "rgba(255, 255, 255, 0.5)";
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[10px] w-[10px] rounded-full"
        style={{
          background: "#ffffff",
          boxShadow:
            "0 0 10px rgba(139, 92, 246, 0.9), 0 0 20px rgba(34, 211, 238, 0.6)",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border transition-[width,height,border-color,margin] duration-200 ease-out"
        style={{
          borderColor: "rgba(255, 255, 255, 0.5)",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
