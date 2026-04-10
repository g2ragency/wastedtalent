import { getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import Footer from "@/components/Footer";

export default async function TermsPage() {
  const [headerData, contactInfo] = await Promise.all([
    getHeaderData(),
    getContactInfo(),
  ]);

  return (
    <>
      <HeaderDynamic data={headerData} />
      <main className="min-h-screen bg-white pt-32 pb-16">
        <div className="w-full px-3 md:px-6">
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 300,
              fontSize: "11px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "32px",
            }}
          >
            Terms and Conditions
          </h1>

          <div
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 300,
              fontSize: "11px",
              lineHeight: "1.8",
              color: "#222222",
              maxWidth: "700px",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              1. General Provisions
            </p>
            <p style={{ marginBottom: "24px" }}>
              These Terms and Conditions govern the sale of products by HB
              production srl, located at Viale Parioli 39c, 00172 Roma, P.IVA:
              IT12380211008 (hereinafter &ldquo;the Seller&rdquo;), through the
              website www.wastedtalent.it.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              2. Product Information
            </p>
            <p style={{ marginBottom: "24px" }}>
              The Seller specializes in the sale of clothing. Each product is
              presented with its main characteristics and price (including VAT
              where applicable). Shipping costs are calculated at checkout.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              3. Payments
            </p>
            <p style={{ marginBottom: "8px" }}>
              We accept the following payment methods:
            </p>
            <ul style={{ marginBottom: "24px", paddingLeft: "16px" }}>
              <li style={{ marginBottom: "4px" }}>
                Credit/Debit Cards (Visa, Mastercard, Amex)
              </li>
              <li style={{ marginBottom: "4px" }}>PayPal</li>
              <li>Klarna (Buy Now, Pay Later)</li>
            </ul>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              4. Shipping and Delivery
            </p>
            <p style={{ marginBottom: "24px" }}>
              We ship to Italy, the European Union, and worldwide. Delivery
              times vary based on the destination. Any customs duties or import
              taxes for non-EU shipments are the responsibility of the customer.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              5. Right of Withdrawal
            </p>
            <p style={{ marginBottom: "24px" }}>
              In accordance with EU law, customers have 14 days from the receipt
              of the goods to exercise their right of withdrawal without
              providing a reason.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              6. Governing Law
            </p>
            <p>
              These terms are governed by Italian law. In the event of a
              dispute, the Court of Rome shall have jurisdiction.
            </p>
          </div>
        </div>
      </main>
      <Footer contactInfo={contactInfo} />
    </>
  );
}
