/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "wasted-talent.local", "wt.g2rdev.it"],
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
  // Configurazione per coesistere con WordPress
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
