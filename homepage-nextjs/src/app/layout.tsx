import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wastedtalent.it"),
  title: {
    default: "Wasted Talent United — Contemporary Streetwear",
    template: "%s | Wasted Talent United",
  },
  description:
    "Wasted Talent United is a contemporary streetwear brand. Shop the latest collections, lookbooks and exclusive drops.",
  keywords: [
    "streetwear",
    "contemporary fashion",
    "wasted talent",
    "streetwear brand",
    "urban clothing",
    "fashion",
    "made in italy",
  ],
  authors: [{ name: "Wasted Talent United" }],
  creator: "Wasted Talent United",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.wastedtalent.it",
    siteName: "Wasted Talent United",
    title: "Wasted Talent United — Contemporary Streetwear",
    description:
      "Wasted Talent United is a contemporary streetwear brand. Shop the latest collections, lookbooks and exclusive drops.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wasted Talent United — Contemporary Streetwear",
    description:
      "Wasted Talent United is a contemporary streetwear brand. Shop the latest collections, lookbooks and exclusive drops.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="2f6d9367-23bf-4377-bc06-1e71337faad8"
          data-blockingmode="auto"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-279P15BEYQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-279P15BEYQ');
          `}
        </Script>
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <SmoothScroll />
            {children}
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
