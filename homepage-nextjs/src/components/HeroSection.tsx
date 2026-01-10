"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroData } from "@/lib/api";

interface HeroSectionProps {
  data: HeroData;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const slides = data.slides || [];

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide % slides.length ? "forward" : "backward");
    setCurrentSlide(index);
  };

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setDirection("forward");
      setCurrentSlide((prev) => prev + 1);
    }, 5000);

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
      {/* Previous Slide */}
      <div className="absolute inset-0">
        {slides[prevIndex].background_image && (
          <div className="absolute inset-0">
            <Image
              src={slides[prevIndex].background_image}
              alt={slides[prevIndex].title || "Slide"}
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(34, 34, 34, 0.1)",
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 flex h-full items-center justify-center text-center">
          <div className="max-w-4xl px-6">
            {slides[prevIndex].title && (
              <h1
                className="mb-4"
                style={{
                  fontSize: "72px",
                  lineHeight: "95%",
                  mixBlendMode: "difference",
                  color: "white",
                  fontWeight: 300,
                }}
                dangerouslySetInnerHTML={{ __html: slides[prevIndex].title }}
              />
            )}

            {slides[prevIndex].subtitle && (
              <p
                className="mb-12 text-4xl font-extralight tracking-tight md:text-5xl lg:text-6xl"
                style={{ mixBlendMode: "difference", color: "white" }}
              >
                {slides[prevIndex].subtitle}
              </p>
            )}

            {slides[prevIndex].cta_text && slides[prevIndex].cta_link && (
              <Link
                href={slides[prevIndex].cta_link}
                className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider transition-all hover:gap-3"
                style={{ mixBlendMode: "difference", color: "white" }}
              >
                {slides[prevIndex].cta_text}
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
      </div>

      {/* Current Slide with curtain effect */}
      <div
        className="absolute inset-0"
        style={{
          animation: "slideIn 1000ms ease-in-out forwards",
          clipPath: "inset(0 0 0 100%)",
        }}
        key={currentSlide}
      >
        <style jsx>{`
          @keyframes slideIn {
            from {
              clip-path: inset(0 0 0 100%);
            }
            to {
              clip-path: inset(0 0 0 0);
            }
          }
        `}</style>
        {slides[currentIndex].background_image && (
          <div className="absolute inset-0">
            <Image
              src={slides[currentIndex].background_image}
              alt={slides[currentIndex].title || "Slide"}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(34, 34, 34, 0.1)",
              }}
            />
          </div>
        )}

        <div className="absolute inset-0 flex h-full items-center justify-center text-center">
          <div className="max-w-4xl px-6">
            {slides[currentIndex].title && (
              <h1
                className="mb-4"
                style={{
                  fontSize: "72px",
                  lineHeight: "95%",
                  mixBlendMode: "difference",
                  color: "white",
                  fontWeight: 300,
                }}
                dangerouslySetInnerHTML={{ __html: slides[currentIndex].title }}
              />
            )}

            {slides[currentIndex].subtitle && (
              <p
                className="mb-12 text-4xl font-extralight tracking-tight md:text-5xl lg:text-6xl"
                style={{ mixBlendMode: "difference", color: "white" }}
              >
                {slides[currentIndex].subtitle}
              </p>
            )}

            {slides[currentIndex].cta_text && slides[currentIndex].cta_link && (
              <Link
                href={slides[currentIndex].cta_link}
                className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider transition-all hover:gap-3"
                style={{ mixBlendMode: "difference", color: "white" }}
              >
                {slides[currentIndex].cta_text}
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
