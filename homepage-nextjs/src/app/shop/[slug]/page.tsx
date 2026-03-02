import { notFound } from "next/navigation";
import { getProductBySlug, getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
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

  return (
    <>
      <HeaderDynamic data={headerData} />
      <ProductDetail product={product} contactInfo={contactInfo} />
    </>
  );
}
