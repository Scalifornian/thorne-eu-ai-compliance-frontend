// src/app/components/ParallaxBanner/ParallaxBanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function ParallaxBanner() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function onScroll() {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || 0;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;

      setOffset(progress * 40);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        height: "360px",
        borderRadius: "28px",
        overflow: "hidden",
        backgroundColor: "#0b0712",
      }}
    >
      <img
        src="/images/thorne-parallax.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "120%",
          objectFit: "cover",
          transform: `translateY(${offset}px)`,
          willChange: "transform",
        }}
      />

      <img
        src="/images/thorne-parallax-dorian.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "420px",
          maxWidth: "70%",
          height: "auto",
          pointerEvents: "none",
          opacity: 0.9,
        }}
      />
    </div>
  );
}
