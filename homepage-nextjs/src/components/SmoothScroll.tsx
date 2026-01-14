"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let targetScroll = window.scrollY;
    let currentScroll = window.scrollY;
    let rafId: number | null = null;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const smoothScroll = () => {
      currentScroll = lerp(currentScroll, targetScroll, 0.1);
      
      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        rafId = null;
      } else {
        window.scrollTo(0, currentScroll);
        rafId = requestAnimationFrame(smoothScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 1024) return;
      
      e.preventDefault();
      
      targetScroll += e.deltaY;
      targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
      
      if (!rafId) {
        rafId = requestAnimationFrame(smoothScroll);
      }
    };

    // Apply only on desktop
    if (window.innerWidth > 1024) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}
