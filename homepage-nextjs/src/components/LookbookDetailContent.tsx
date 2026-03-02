'use client'

import Image from "next/image"
import Link from "next/link"
import { LookbookDetail } from "@/lib/api"
import Footer from "@/components/Footer"

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
                  width={2560}
                  height={1707}
                  className="w-full h-auto"
                  sizes="100vw"
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
      <Footer />

    </main>
  )
}
