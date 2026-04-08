"use client";

import Image from "next/image";
import Link from "next/link";
import { AboutData } from "@/lib/api";
import Footer from "@/components/Footer";
import { ContactInfo } from "@/lib/api";

interface AboutContentProps {
  data: AboutData;
  contactInfo?: ContactInfo;
}

export default function AboutContent({ data, contactInfo }: AboutContentProps) {
  return (
    <main className="min-h-screen bg-white">
      {/* ======================== MANIFESTO ======================== */}
      <section className="pt-32 pb-16 px-3 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Title */}
          <div>
            <h1
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 300,
                letterSpacing: "0%",
              }}
            >
              Manifesto
            </h1>
          </div>

          {/* Right: Text */}
          <div className="pl-[70px] lg:pl-0">
            {data.manifesto.text ? (
              <div
                className="text-sm lg:text-base leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: data.manifesto.text }}
              />
            ) : (
              <p className="text-sm text-gray-400">
                Add manifesto text from Site Manager.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Manifesto: Image + Product row */}
      {(data.manifesto.images.length > 0 ||
        data.manifesto.products.length > 0) && (
        <section className="pb-3 md:pb-16 px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8">
            {/* Large image on left */}
            {data.manifesto.images[0] && (
              <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[3/4]">
                <Image
                  src={data.manifesto.images[0]}
                  alt="Manifesto"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Product card on right */}
            {data.manifesto.products[0] && (
              <div className="flex flex-col items-center lg:items-start justify-end">
                <Link href={`/shop/${data.manifesto.products[0].slug}`}>
                  <div className="relative w-[200px] lg:w-full max-w-[300px] h-[247px] lg:h-auto lg:aspect-[3/4] bg-gray-100 mb-4">
                    {data.manifesto.products[0].image && (
                      <Image
                        src={data.manifesto.products[0].image}
                        alt={data.manifesto.products[0].name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="font-bold" style={{ fontSize: "15px" }}>
                    {data.manifesto.products[0].name}
                  </p>
                  <p
                    className="font-bold"
                    style={{ fontSize: "15px", color: "#999999" }}
                  >
                    {data.manifesto.products[0].price}€
                  </p>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Manifesto: Gallery — 1 full width + 2 side by side */}
      <section className="pb-16 px-3 md:px-6">
        <div className="space-y-3 md:space-y-4">
          {/* Full width image */}
          {data.manifesto.gallery?.[0] && (
            <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[16/9]">
              <Image
                src={data.manifesto.gallery[0]}
                alt="Manifesto gallery 1"
                fill
                className="object-cover"
              />
            </div>
          )}
          {!data.manifesto.gallery?.[0] && (
            <div className="w-full h-[500px] lg:h-auto lg:aspect-[16/9] bg-gray-100" />
          )}

          {/* Two images side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-0">
            {data.manifesto.gallery?.[1] ? (
              <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[4/5]">
                <Image
                  src={data.manifesto.gallery[1]}
                  alt="Manifesto gallery 2"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-[500px] lg:h-auto lg:aspect-[4/5] bg-gray-100" />
            )}
            {data.manifesto.gallery?.[2] ? (
              <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[4/5]">
                <Image
                  src={data.manifesto.gallery[2]}
                  alt="Manifesto gallery 3"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-[500px] lg:h-auto lg:aspect-[4/5] bg-gray-200" />
            )}
          </div>
        </div>
      </section>

      {/* ======================== VISIONE ======================== */}
      <section className="pb-16 px-3 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Title */}
          <div>
            <h2
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 300,
                fontSize: "60px",
                lineHeight: "95%",
                letterSpacing: "0%",
              }}
            >
              Visione
            </h2>
          </div>

          {/* Right: Text */}
          <div className="pl-[70px] lg:pl-0">
            {data.visione.text ? (
              <div
                className="text-sm lg:text-base leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: data.visione.text }}
              />
            ) : (
              <p className="text-sm text-gray-400">
                Add visione text from Site Manager.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Visione: Image + Product row */}
      {(data.visione.images.length > 0 || data.visione.products.length > 0) && (
        <section className="pb-3 md:pb-16 px-3 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8">
            {/* Large image on left */}
            {data.visione.images[0] && (
              <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[3/4]">
                <Image
                  src={data.visione.images[0]}
                  alt="Visione"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Product card on right */}
            {data.visione.products[0] && (
              <div className="flex flex-col items-center lg:items-start justify-end">
                <Link href={`/shop/${data.visione.products[0].slug}`}>
                  <div className="relative w-[200px] lg:w-full max-w-[300px] h-[247px] lg:h-auto lg:aspect-[3/4] bg-gray-100 mb-4">
                    {data.visione.products[0].image && (
                      <Image
                        src={data.visione.products[0].image}
                        alt={data.visione.products[0].name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="font-bold" style={{ fontSize: "15px" }}>
                    {data.visione.products[0].name}
                  </p>
                  <p
                    className="font-bold"
                    style={{ fontSize: "15px", color: "#999999" }}
                  >
                    {data.visione.products[0].price}€
                  </p>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Visione: Gallery — 1 full width + 2 side by side */}
      <section className="pb-16 px-3 md:px-6">
        <div className="space-y-3 md:space-y-4">
          {/* Full width image */}
          {data.visione.gallery?.[0] && (
            <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[16/9]">
              <Image
                src={data.visione.gallery[0]}
                alt="Visione gallery 1"
                fill
                className="object-cover"
              />
            </div>
          )}
          {!data.visione.gallery?.[0] && (
            <div className="w-full h-[500px] lg:h-auto lg:aspect-[16/9] bg-gray-100" />
          )}

          {/* Two images side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-0">
            {data.visione.gallery?.[1] ? (
              <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[4/5]">
                <Image
                  src={data.visione.gallery[1]}
                  alt="Visione gallery 2"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-[500px] lg:h-auto lg:aspect-[4/5] bg-gray-100" />
            )}
            {data.visione.gallery?.[2] ? (
              <div className="relative w-full h-[500px] lg:h-auto lg:aspect-[4/5]">
                <Image
                  src={data.visione.gallery[2]}
                  alt="Visione gallery 3"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-[500px] lg:h-auto lg:aspect-[4/5] bg-gray-200" />
            )}
          </div>
        </div>
      </section>
      <Footer contactInfo={contactInfo} />
    </main>
  );
}
