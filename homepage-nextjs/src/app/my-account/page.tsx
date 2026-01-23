import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import Link from "next/link";

export default async function MyAccountPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="text-4xl font-light mb-8">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/my-account/orders"
              className="border p-6 hover:border-black transition-colors"
            >
              <h2 className="text-xl font-bold mb-2">Orders</h2>
              <p className="text-sm text-gray-600">View your order history</p>
            </Link>

            <Link
              href="/my-account/addresses"
              className="border p-6 hover:border-black transition-colors"
            >
              <h2 className="text-xl font-bold mb-2">Addresses</h2>
              <p className="text-sm text-gray-600">Manage shipping addresses</p>
            </Link>

            <Link
              href="/my-account/account-details"
              className="border p-6 hover:border-black transition-colors"
            >
              <h2 className="text-xl font-bold mb-2">Account Details</h2>
              <p className="text-sm text-gray-600">
                Edit your account information
              </p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
