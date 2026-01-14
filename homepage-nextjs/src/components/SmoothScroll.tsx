"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Smooth scroll implementation
    let currentScroll = window.scrollY;
    let isScrolling = false;

    const smoothScrollTo = (targetY: number) => {
      const startY = window.scrollY;
      const distance = targetY - startY;
      const duration = 1200; // Aumentato per rendere lo scroll più lento
      let startTime: number | null = null;

      const easeInOutQuad = (t: number): number => {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutQuad(progress);

        window.scrollTo(0, startY + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          isScrolling = false;
        }
      };

      isScrolling = true;
      requestAnimationFrame(animation);
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth <= 1024) return;
      
      e.preventDefault();
      
      if (!isScrolling) {
        currentScroll = window.scrollY;
      }
      
      currentScroll += e.deltaY * 0.5; // Ridotto il moltiplicatore per rendere lo scroll più graduale
      currentScroll = Math.max(0, Math.min(currentScroll, document.body.scrollHeight - window.innerHeight));
      
      smoothScrollTo(currentScroll);
    };

    // Apply only on desktop
    if (window.innerWidth > 1024) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return null;
}
