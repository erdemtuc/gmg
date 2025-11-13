import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config) => {
    // Find the file loader rule that handles images/asset files
    const assetRule = config.module.rules.find((rule: any) =>
      rule.test && typeof rule.test.test === 'function' && 
      rule.test.test('.svg')
    );

    if (assetRule) {
      // Exclude SVG files from the default asset rule
      assetRule.exclude = /\.svg$/i;
    }

    // Add the SVGR rule for SVG files with correct configuration
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            dimensions: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;