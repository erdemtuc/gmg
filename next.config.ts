import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    // Exclude SVGs from Next's image loader
    const imageRule = config.module.rules.find(
      (rule: any) => rule.test instanceof RegExp && rule.test.test(".svg"),
    );

    if (imageRule) {
      imageRule.exclude = /\.svg$/;
    }

    // Add SVGR
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
