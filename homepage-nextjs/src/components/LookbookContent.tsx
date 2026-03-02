'use client'

import Image from "next/image"
import Link from "next/link"
import { LookbookItem } from "@/lib/api"
import Footer from "@/components/Footer"
import { ContactInfo } from "@/lib/api"

interface LookbookContentProps {
  lookbooks: LookbookItem[];
  contactInfo?: ContactInfo;
}

export default function LookbookContent({ lookbooks, contactInfo }: LookbookContentProps) {
  // Group lookbooks in pairs for alternating rows
  const rows: LookbookItem[][] = [];
  for (let i = 0; i < lookbooks.length; i += 2) {
    rows.push(lookbooks.slice(i, i + 2));
  }

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

      {/* Lookbook Grid - alternating 66/33 and 33/66 */}
      <section className="px-6 pb-20">
        <div className="flex flex-col gap-[20px]">
          {rows.map((row, rowIndex) => {
            const isEven = rowIndex % 2 === 0;

            return (
              <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-3 gap-[20px]" style={{ minHeight: 0 }}>
                {row[0] && (
                  <Link
                    href={`/lookbook/${row[0].slug}`}
                    className={`group flex flex-col ${isEven ? 'md:col-span-2' : 'md:col-span-1'}`}
                  >
                    <div className="relative w-full flex-1 overflow-hidden bg-gray-100" style={{ aspectRatio: isEven ? '16/9' : undefined }}>
                      {row[0].cover_image ? (
                        <Image
                          src={row[0].cover_image}
                          alt={row[0].title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>
                    <h2 style={{ fontSize: "18px", fontWeight: "bold" }} className="mt-3">{row[0].title}</h2>
                    {row[0].year && (
                      <p style={{ fontSize: "18px", fontWeight: "bold" }} className="text-gray-500">{row[0].year}</p>
                    )}
                  </Link>
                )}
                {row[1] && (
                  <Link
                    href={`/lookbook/${row[1].slug}`}
                    className={`group flex flex-col ${isEven ? 'md:col-span-1' : 'md:col-span-2'}`}
                  >
                    <div className="relative w-full flex-1 overflow-hidden bg-gray-100" style={{ aspectRatio: !isEven ? '16/9' : undefined }}>
                      {row[1].cover_image ? (
                        <Image
                          src={row[1].cover_image}
                          alt={row[1].title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </div>
                    <h2 style={{ fontSize: "18px", fontWeight: "bold" }} className="mt-3">{row[1].title}</h2>
                    {row[1].year && (
                      <p style={{ fontSize: "18px", fontWeight: "bold" }} className="text-gray-500">{row[1].year}</p>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {lookbooks.length === 0 && (
          <p className="text-gray-400 text-sm">No lookbooks available.</p>
        )}
      </section>
      <Footer contactInfo={contactInfo} />

    </main>
  )
}
