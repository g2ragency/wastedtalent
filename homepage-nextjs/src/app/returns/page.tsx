import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";

export default async function ReturnsPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="text-4xl font-light mb-8">Returns & Exchanges</h1>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">Return Policy</h2>
            <p className="mb-6">
              We accept returns within 30 days of purchase. Items must be
              unworn, unwashed, and in original condition with all tags
              attached.
            </p>

            <h2 className="text-2xl font-bold mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-2 mb-6">
              <li>Contact our customer service team</li>
              <li>Pack your items securely</li>
              <li>Ship to the address provided</li>
              <li>Receive your refund within 7-10 business days</li>
            </ol>

            <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
            <p className="mb-6">
              We offer free exchanges for different sizes or colors. Contact us
              to arrange an exchange.
            </p>

            <div className="mt-8">
              <a
                href="mailto:support@wastedtalent.com"
                className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase hover:bg-gray-800 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
