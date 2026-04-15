import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ProductDetail from "@/components/ProductDetail";

export const revalidate = 60;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const plainDescription = product.short_description
    ? product.short_description.replace(/<[^>]*>/g, "").trim()
    : product.description
      ? product.description.replace(/<[^>]*>/g, "").trim().slice(0, 160)
      : `Shop ${product.name} at Wasted Talent United.`;

  const images = product.images?.length
    ? product.images.map((img) => ({
        url: img.src,
        width: 800,
        height: 800,
        alt: img.alt || product.name,
      }))
    : [];

  return {
    title: product.name,
    description: plainDescription,
    openGraph: {
      title: `${product.name} | Wasted Talent United`,
      description: plainDescription,
      type: "website",
      url: `https://www.wastedtalent.it/shop/${product.slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Wasted Talent United`,
      description: plainDescription,
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, headerData, contactInfo] = await Promise.all([
    getProductBySlug(params.slug),
    getHeaderData(),
    getContactInfo(),
  ]);

  if (!product) {
    notFound();
  }

  // Structured Data (JSON-LD) for Product
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description
      ? product.short_description.replace(/<[^>]*>/g, "").trim()
      : product.description
        ? product.description.replace(/<[^>]*>/g, "").trim().slice(0, 300)
        : "",
    image: product.images?.map((img) => img.src) || [],
    url: `https://www.wastedtalent.it/shop/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Wasted Talent United",
    },
    offers: {
      "@type": "Offer",
      url: `https://www.wastedtalent.it/shop/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price || "0",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Wasted Talent United",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderDynamic data={headerData} />
      <ProductDetail product={product} contactInfo={contactInfo} />
    </>
  );
}
