import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // For GitHub Pages static deployment, change output to:
  // output: "export",
  // And set basePath to your repo name:
  // basePath: "/your-repo-name",
  // images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
