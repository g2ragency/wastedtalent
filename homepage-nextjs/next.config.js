/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "wasted-talent.local"], // Aggiungi il dominio del tuo sito WordPress
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  env: {
    WORDPRESS_API_URL:
      process.env.WORDPRESS_API_URL || "http://wasted-talent.local/wp-json",
  },
  // Configurazione per coesistere con WordPress
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
