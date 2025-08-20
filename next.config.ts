import type { NextConfig } from "next";

const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE;
let r2Host: string | undefined;
try {
  if (r2Base) r2Host = new URL(r2Base).hostname;
} catch {}

const remotePatterns: { protocol: "https"; hostname: string }[] = [
  { protocol: "https", hostname: "images.unsplash.com" },
];

if (r2Host) {
  remotePatterns.push({ protocol: "https", hostname: r2Host });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  images: {
    remotePatterns,
  },
};

export default nextConfig;
