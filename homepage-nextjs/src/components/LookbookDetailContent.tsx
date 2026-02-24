'use client'

import Image from "next/image"
import Link from "next/link"
import { LookbookDetail } from "@/lib/api"

interface LookbookDetailContentProps {
  lookbook: LookbookDetail;
}

export default function LookbookDetailContent({ lookbook }: LookbookDetailContentProps) {
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
          {lookbook.title}
        </h1>
        {lookbook.year && (
          <p className="text-sm text-gray-500 mt-2">{lookbook.year}</p>
        )}
      </section>

      {/* Gallery */}
      <section className="px-6 pb-20">
        {lookbook.gallery.length > 0 ? (
          <div className="space-y-4">
            {lookbook.gallery.map((image, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={image}
                  alt={`${lookbook.title} - ${index + 1}`}
                  width={1920}
                  height={1280}
                  className="w-full h-auto"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No images in this lookbook yet.</p>
        )}
      </section>

      {/* Back link */}
      <section className="px-6 pb-20">
        <Link href="/lookbook" className="text-sm underline hover:no-underline">
          ← Back to Lookbook
        </Link>
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
