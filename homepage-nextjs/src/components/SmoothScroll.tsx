"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Lenis Smooth Scroll implementation
    let rafId: number;
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    const smoothness = 0.08; // Lower = smoother but slower

    const smoothScrollTo = () => {
      currentScroll += (targetScroll - currentScroll) * smoothness;
      
      if (Math.abs(targetScroll - currentScroll) < 0.05) {
        currentScroll = targetScroll;
      }
      
      window.scrollTo(0, currentScroll);
      
      if (currentScroll !== targetScroll) {
        rafId = requestAnimationFrame(smoothScrollTo);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      targetScroll += e.deltaY;
      targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));
      
      if (!rafId) {
        rafId = requestAnimationFrame(smoothScrollTo);
      }
    };

    // Only apply on desktop
    if (window.innerWidth > 1024) {
      window.addEventListener('wheel', handleWheel, { passive: true });
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
