import { notFound } from "next/navigation";
import { getProductBySlug, getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ProductDetail from "@/components/ProductDetail";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  const headerData = await getHeaderData();

  if (!product) {
    notFound();
  }

  return (
    <>
      <HeaderDynamic data={headerData} />
      <ProductDetail product={product} />
    </>
  );
}
