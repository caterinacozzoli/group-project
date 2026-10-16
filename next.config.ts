import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sito statico, pubblicabile su GitHub Pages
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
