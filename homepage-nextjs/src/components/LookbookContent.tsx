'use client'

import Image from "next/image"
import Link from "next/link"
import { LookbookItem } from "@/lib/api"

interface LookbookContentProps {
  lookbooks: LookbookItem[];
}

export default function LookbookContent({ lookbooks }: LookbookContentProps) {
  return (
    <main className="min-h-screen bg-white">

      {/* Title */}
      <section className="pt-32 pb-12 px-6">
        <h1 style={{
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 300,
          fontSize: '60px',
          lineHeight: '95%',
          letterSpacing: '0%',
        }}>
          Lookbook
        </h1>
      </section>

      {/* Lookbook Grid */}
      <section className="px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
          {lookbooks.map((lookbook) => (
            <Link key={lookbook.id} href={`/lookbook/${lookbook.slug}`} className="group">
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                {lookbook.cover_image ? (
                  <Image
                    src={lookbook.cover_image}
                    alt={lookbook.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <h2 className="font-bold text-sm mt-3">{lookbook.title}</h2>
              {lookbook.year && (
                <p className="text-sm text-gray-500">{lookbook.year}</p>
              )}
            </Link>
          ))}
        </div>

        {lookbooks.length === 0 && (
          <p className="text-gray-400 text-sm">No lookbooks available.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="w-full px-6 mt-20 pt-12 border-t">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Join our newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="E-mail address" className="flex-1 border-b border-black pb-2 text-sm focus:outline-none" />
              <button className="text-xl">→</button>
            </div>
            <p className="text-xs text-gray-500 mt-4">You may unsubscribe at any time. To find out more, please visit our Privacy Policy.</p>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Help center</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/shipping">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Follow us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://instagram.com" target="_blank">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
              <li><a href="https://spotify.com" target="_blank">Spotify</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs mb-4 uppercase">Policy</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between py-6 border-t">
          <div className="text-sm">©2026 Wasted Talent United - All Rights Reserved</div>
        </div>
      </footer>

    </main>
  )
}
