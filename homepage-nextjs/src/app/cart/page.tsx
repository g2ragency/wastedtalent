import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import CartContent from "@/components/CartContent";

export default async function CartPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <CartContent />
    </>
  );
}
