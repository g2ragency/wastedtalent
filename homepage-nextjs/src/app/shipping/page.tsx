import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";

export default async function ShippingPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="text-4xl font-light mb-8">Shipping Information</h1>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Shipping Methods</h2>
            <div className="space-y-4 mb-8">
              <div className="border p-4">
                <h3 className="font-bold mb-2">
                  Standard Shipping (5-7 business days)
                </h3>
                <p className="text-sm">€10.00</p>
              </div>
              <div className="border p-4">
                <h3 className="font-bold mb-2">
                  Express Shipping (2-3 business days)
                </h3>
                <p className="text-sm">€25.00</p>
              </div>
              <div className="border p-4">
                <h3 className="font-bold mb-2">Next Day Delivery</h3>
                <p className="text-sm">€40.00</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Free Shipping</h2>
            <p className="mb-6">
              Enjoy free standard shipping on all orders over €150.
            </p>

            <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
            <p className="mb-6">
              We ship worldwide. International shipping times and costs vary by
              destination. Customs fees and duties are the responsibility of the
              customer.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
