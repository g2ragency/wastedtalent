import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import OrderConfirmationContent from "@/components/OrderConfirmationContent";

export default async function OrderConfirmationPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <OrderConfirmationContent />
    </>
  );
}
