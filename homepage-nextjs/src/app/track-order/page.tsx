import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";

export default async function TrackOrderPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="font-light mb-8">Track Your Order</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Order Number
              </label>
              <input
                type="text"
                placeholder="Enter your order number"
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#222222]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#222222]"
              />
            </div>

            <button className="w-full bg-[#222222] text-white py-4 font-bold text-sm uppercase border border-[#222222] hover:bg-transparent hover:text-[#222222] transition-all">
              Track Order
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
