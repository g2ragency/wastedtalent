import { getHeaderData, getContactInfo } from "@/lib/api";
import HeaderDynamic from "@/components/HeaderDynamic";
import Footer from "@/components/Footer";

export default async function ShippingPage() {
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
            Return &amp; Refund Policy
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
            <p style={{ marginBottom: "24px" }}>
              At Wasted Talent, we want you to be completely satisfied with your
              purchase. If you are not happy with your order, we offer a
              straightforward return process.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Return Conditions:
            </p>
            <ul style={{ marginBottom: "24px", paddingLeft: "16px" }}>
              <li style={{ marginBottom: "4px" }}>
                Items must be returned within 14 days of delivery.
              </li>
              <li>
                Items must be in their original condition: unworn, unwashed, and
                with all tags attached.
              </li>
            </ul>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              How to Start a Return:
            </p>
            <p style={{ marginBottom: "24px" }}>
              To initiate a return, please send an email to{" "}
              <a
                href="mailto:info@wastedtalent.it"
                style={{ textDecoration: "underline" }}
              >
                info@wastedtalent.it
              </a>
              . Our team will get back to you with instructions and the prepaid
              shipping label.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Return Costs:
            </p>
            <p style={{ marginBottom: "24px" }}>
              Returns are free of charge for the customer. We will provide a
              shipping label or arrange a pickup at our expense.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Refunds:
            </p>
            <p>
              Once we receive and inspect your return, we will process your
              refund within 7-10 business days. The refund will be credited back
              to your original payment method (Credit Card, PayPal, or Klarna).
            </p>
          </div>
        </div>
      </main>
      <Footer contactInfo={contactInfo} />
    </>
  );
}
