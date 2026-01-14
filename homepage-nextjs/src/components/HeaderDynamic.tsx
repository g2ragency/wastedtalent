"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HeaderData } from "@/lib/api";

interface HeaderProps {
  data: HeaderData;
}

// Funzione per convertire URL assoluti WordPress in path relativi
function getRelativePath(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    // Se non è un URL valido, restituisci così com'è
    return url;
  }
}

export default function Header({ data }: HeaderProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const leftMenuItems = data.left_menu || [];
  const rightMenuItems = data.right_menu || [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className="fixed top-0 z-50 w-full"
      style={{ 
        backgroundColor: isHomepage ? (scrolled ? '#FFFFFF' : 'transparent') : '#FFFFFF',
        transition: isHomepage ? 'background-color 0.3s' : 'none'
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">
        {/* Left Menu */}
        <nav className="flex flex-1 items-center gap-8">
          {leftMenuItems.map((item) => (
            <Link
              key={item.id}
              href={getRelativePath(item.url)}
              target={item.target || "_self"}
              className="uppercase transition-opacity hover:opacity-60"
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "0.95",
                color: isHomepage ? "white" : "black",
                letterSpacing: "-0.1px",
                mixBlendMode: isHomepage ? "difference" : "normal",
              }}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Center Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="block">
            <img
              src="/logo.svg"
              alt="Wasted Talent United"
              className="h-12 w-auto"
              style={{ mixBlendMode: "difference", filter: "invert(1)" }}
            />
          </Link>
        </div>

        {/* Right Menu */}
        <nav className="flex flex-1 items-center justify-end gap-8">
          {rightMenuItems.map((item) => (
            <Link
              key={item.id}
              href={getRelativePath(item.url)}
              target={item.target || "_self"}
              className="uppercase transition-opacity hover:opacity-60"
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "0.95",
                color: isHomepage ? "white" : "black",
                letterSpacing: "-0.1px",
                mixBlendMode: isHomepage ? "difference" : "normal",
              }}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
