const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  images: {
    domains: ["rcuficvjsjdizfigkdfx.supabase.co"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
};

module.exports = withPWA(nextConfig);
