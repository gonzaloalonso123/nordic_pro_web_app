import withPWA from "next-pwa";

const nextConfig = {
  images: {
    domains: ["rcuficvjsjdizfigkdfx.supabase.co"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    register: true,
    skipWaiting: true,
  },
};

export default withPWA(nextConfig);
