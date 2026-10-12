import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Vignettes des galeries paper34.fr (frise « Les courses en photos »).
    remotePatterns: [{ protocol: "https", hostname: "pub-054d5e4ec36144bea38e07a1452fe2b0.r2.dev" }],
  },
};

export default nextConfig;
