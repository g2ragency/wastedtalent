import { getProducts, getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import ShopContent from "@/components/ShopContent";

export const revalidate = 60;

export default async function ShopPage() {
  const [products, headerData, contactInfo] = await Promise.all([
    getProducts(),
    getHeaderData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <ShopContent products={products} contactInfo={contactInfo} />
    </>
  );
}
