import { getHeaderData } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";

export default async function PrivacyPage() {
  const headerData = await getHeaderData();

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-6">
          <h1 className="text-4xl font-light mb-8">Privacy Policy</h1>

          <div className="prose max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p>
                This Privacy Policy describes how Wasted Talent United collects,
                uses, and protects your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                Information We Collect
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Name and contact information</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information</li>
                <li>Order history</li>
                <li>Website usage data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and updates</li>
                <li>Improve our products and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information from unauthorized access, disclosure, or
                misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal
                information. Contact us to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact
                us at privacy@wastedtalent.com
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
