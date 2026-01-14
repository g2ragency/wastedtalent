import { getProducts } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ShopContent from "@/components/ShopContent";
import { getHeaderData } from "@/lib/api";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  const products = await getProducts();
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <ShopContent products={products} />
    </>
  );
}
