import type { NextConfig } from "next";

// ⚠️ CHANGE THIS to your GitHub repo name!
// Example: if your repo URL is https://github.com/ali123/furtherchat
// then set basePath: "/furtherchat"
// If you use a custom domain like furtherchat.com, remove basePath entirely.
const repoName = "furtherchat";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repoName}`,
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
