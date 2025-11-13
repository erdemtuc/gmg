import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude SVGs from the default asset loader
    const imageLoader = config.module.rules.find((rule: any) => {
      if (rule.test && typeof rule.test.exec === 'function') {
        return rule.test.exec('.svg');
      }
    });

    if (imageLoader) {
      imageLoader.exclude = /\.svg$/;
    }

    // Add SVGR loader for SVGs
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
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