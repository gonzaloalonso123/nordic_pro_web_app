/** @type {import('next').NextConfig} */
const isMobile = process.env.NEXT_PUBLIC_IS_MOBILE === "true";
const nextConfig = {
  ...(isMobile ? { output: "export" } : {}),
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["rcuficvjsjdizfigkdfx.supabase.co"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
};

module.exports = nextConfig;
