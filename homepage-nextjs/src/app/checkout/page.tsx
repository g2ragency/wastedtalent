import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import CheckoutContent from "@/components/CheckoutContent";

export default async function CheckoutPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <CheckoutContent />
    </>
  );
}
