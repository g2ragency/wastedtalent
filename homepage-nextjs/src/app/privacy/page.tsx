import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";

export default async function PrivacyPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="font-light mb-8">Privacy Policy</h1>

          <div className="prose max-w-none space-y-8 text-[#222]">
            <section>
              <h2 className="text-lg font-bold mb-3">1. Data Controller</h2>
              <p>
                The data controller is HB production srl, Viale Parioli 39c,
                00172 Roma. Email:{" "}
                <a href="mailto:info@wastedtalent.it" className="underline">
                  info@wastedtalent.it
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3">2. Data Collected</h2>
              <p className="mb-2">
                We collect personal data necessary for processing orders and
                providing services, including:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Contact information (Name, Email, Phone)</li>
                <li>Shipping and Billing address</li>
                <li>
                  Payment information (processed securely via encrypted gateways)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3">
                3. Purpose of Processing
              </h2>
              <ul className="space-y-3">
                <li>
                  <strong>Order Fulfillment:</strong> To ship your clothing and
                  manage payments.
                </li>
                <li>
                  <strong>Marketing:</strong> If you subscribe to our Newsletter,
                  we will send you updates and promotions. You can unsubscribe at
                  any time.
                </li>
                <li>
                  <strong>Analytics &amp; Tracking:</strong> We use Google
                  Analytics and Facebook Pixel to understand website traffic and
                  improve our advertising performance.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3">4. Data Sharing</h2>
              <p className="mb-2">
                We share your data only with essential third parties:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Shipping carriers (for delivery)</li>
                <li>Payment providers (PayPal, Klarna)</li>
                <li>
                  Marketing platforms (for newsletter and retargeting ads)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3">5. Your Rights</h2>
              <p>
                Under the GDPR, you have the right to access, correct, or delete
                your personal data. To exercise these rights, contact us at{" "}
                <a href="mailto:info@wastedtalent.it" className="underline">
                  info@wastedtalent.it
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-3">6. Cookies</h2>
              <p>
                This site uses cookies to enhance user experience and for
                marketing purposes. By using our site, you consent to our use of
                cookies.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
