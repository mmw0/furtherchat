import type { NextConfig } from "next";

// ⚠️ FOR GITHUB PAGES: Change this to your GitHub repo name!
// Example: if your repo URL is https://github.com/ali123/furtherchat
// then set repoName = "furtherchat"
// If you use a custom domain like furtherchat.com, set repoName = ""
const repoName = "furtherchat";

const nextConfig: NextConfig = {
  output: "export",
  // basePath is only added when building for GitHub Pages (GITHUB_PAGES=true)
  // For local dev/preview, no basePath is needed
  ...(process.env.GITHUB_PAGES === "true" && repoName ? { basePath: `/${repoName}` } : {}),
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
