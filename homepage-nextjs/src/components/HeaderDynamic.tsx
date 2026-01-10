"use client";

import Link from "next/link";
import { HeaderData } from "@/lib/api";

interface HeaderProps {
  data: HeaderData;
}

export default function Header({ data }: HeaderProps) {
  const leftMenuItems = data.left_menu || [];
  const rightMenuItems = data.right_menu || [];

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">
        {/* Left Menu */}
        <nav className="flex flex-1 items-center gap-8">
          {leftMenuItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              target={item.target || "_self"}
              className="uppercase transition-opacity hover:opacity-60"
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "0.95",
                color: "white",
                letterSpacing: "-0.1px",
                mixBlendMode: "difference",
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
              href={item.url}
              target={item.target || "_self"}
              className="uppercase transition-opacity hover:opacity-60"
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "0.95",
                color: "white",
                letterSpacing: "-0.1px",
                mixBlendMode: "difference",
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
