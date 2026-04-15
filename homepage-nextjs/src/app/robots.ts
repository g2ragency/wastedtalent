import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/account/",
          "/my-account/",
          "/checkout/",
          "/cart/",
          "/order-confirmation/",
          "/login/",
          "/register/",
          "/forgot-password/",
          "/track-order/",
          "/maintenance/",
        ],
      },
    ],
    sitemap: "https://www.wastedtalent.it/sitemap.xml",
  };
}
