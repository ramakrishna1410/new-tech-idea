import type { NextConfig } from "next";

// Served as a GitHub Pages project site at
// https://<user>.github.io/new-tech-idea/ — the repo name must be baked in
// as the base path so every route and asset resolves correctly.
const repoName = "new-tech-idea";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
