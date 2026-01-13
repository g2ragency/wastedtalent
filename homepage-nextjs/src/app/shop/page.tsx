import Link from "next/link";
import Image from "next/image";
import { getProducts, WooCommerceProduct } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import { getHeaderData } from "@/lib/api";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  const products = await getProducts();
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-light mb-4">F/W 2026</h1>
            <div className="flex items-center justify-between">
              <button className="text-sm flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Filters
              </button>
              <p className="text-sm">{products.length} products</p>
              <button className="text-sm">
                Sort by
                <svg className="inline ml-1" width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group"
              >
                <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      width={400}
                      height={533}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  {product.price_html ? (
                    <span dangerouslySetInnerHTML={{ __html: product.price_html }} />
                  ) : (
                    `${product.price}€`
                  )}
                </p>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500">Nessun prodotto disponibile</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="max-w-[1400px] mx-auto px-6 mt-20 pt-12 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="font-bold text-xs mb-4 uppercase">Join our newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="E-mail address"
                  className="flex-1 border-b border-black pb-2 text-sm focus:outline-none"
                />
                <button className="text-xl">→</button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                You may unsubscribe at any time. To find out more, please visit our Privacy Policy.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-xs mb-4 uppercase">Help center</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/shipping">Shipping & FAQs</Link></li>
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
            <div className="text-sm">
              ©2026 Wasted Talent United - All Rights Reserved
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

