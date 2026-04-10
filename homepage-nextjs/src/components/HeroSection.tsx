"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroData } from "@/lib/api";

interface HeroSectionProps {
  data: HeroData;
}

function SlideContent({ slide }: { slide: any }) {
  return (
    <>
      {slide.background_image && (
        <div className="absolute inset-0">
          <Image
            src={slide.background_image}
            alt={slide.title || "Slide"}
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6))",
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 flex h-full items-center justify-center text-center">
        <div className="max-w-4xl px-3 md:px-6">
          {slide.title && (
            <h1
              className="mb-4 hero-title"
              style={{
                lineHeight: "95%",
                mixBlendMode: "difference",
                color: "white",
                fontWeight: 300,
              }}
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />
          )}

          {slide.subtitle && (
            <p
              className="mb-12 text-2xl font-extralight tracking-tight md:text-4xl lg:text-6xl"
              style={{ mixBlendMode: "difference", color: "white" }}
            >
              {slide.subtitle}
            </p>
          )}

          {slide.cta_text && slide.cta_link && (
            <Link
              href={slide.cta_link}
              className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider transition-all hover:gap-3"
              style={{ mixBlendMode: "difference", color: "white" }}
            >
              {slide.cta_text}
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default function HeroSection({ data }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const slides = data?.slides || [];

  const goToSlide = (index: number) => {
    setIsFirstLoad(false);
    setDirection(index > currentSlide % slides.length ? "forward" : "backward");
    setCurrentSlide(index);
  };

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setIsFirstLoad(false);
      setDirection("forward");
      setCurrentSlide((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const currentIndex = currentSlide % slides.length;
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: "#F2F2F2" }}
    >
      <style jsx global>{`
        .hero-title {
          font-size: 40px;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 72px;
          }
        }
        @keyframes heroSlideIn {
          from {
            clip-path: inset(0 0 0 100%);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>

      {/* Previous Slide */}
      <div className="absolute inset-0">
        <SlideContent slide={slides[prevIndex]} />
      </div>

      {/* Current Slide with curtain effect */}
      <div
        className="absolute inset-0"
        style={
          isFirstLoad
            ? {}
            : {
                animation: "heroSlideIn 1000ms ease-in-out forwards",
                clipPath: "inset(0 0 0 100%)",
              }
        }
        key={currentSlide}
      >
        <SlideContent slide={slides[currentIndex]} />
      </div>

      {/* Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-[2px] w-8 transition-all ${
                index === currentIndex ? "opacity-100" : "opacity-30"
              }`}
              style={{ mixBlendMode: "difference", backgroundColor: "white" }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
