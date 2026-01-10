import Image from "next/image";
import Link from "next/link";
import { FeaturedProductsData } from "@/lib/api";

interface FeaturedProductsProps {
  data: FeaturedProductsData;
}

export default function FeaturedProducts({ data }: FeaturedProductsProps) {
  if (!data.products || data.products.length === 0) {
    return null;
  }

  return (
    <section className="bg-lightgold py-20">
      <div className="mx-auto max-w-1360 px-6">
        <h2 className="mb-12 text-center text-5xl font-bold text-blue">
          {data.title}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.products.map((product) => (
            <Link
              key={product.id}
              href={product.permalink}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
            >
              {/* Product Image */}
              {product.image && (
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  {product.sale_price && (
                    <div className="absolute right-4 top-4 bg-gold px-3 py-1 text-sm font-bold text-blue">
                      SCONTO
                    </div>
                  )}
                </div>
              )}

              {/* Product Info */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-blue group-hover:text-gold">
                  {product.name}
                </h3>

                {product.description && (
                  <p
                    className="mb-4 line-clamp-2 text-sm text-grey"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    {product.sale_price ? (
                      <>
                        <span className="text-2xl font-bold text-gold">
                          €{product.sale_price}
                        </span>
                        <span className="text-sm text-grey line-through">
                          €{product.regular_price}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-blue">
                        €{product.price}
                      </span>
                    )}
                  </div>

                  {!product.in_stock && (
                    <span className="text-sm font-bold text-red-600">
                      Esaurito
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
