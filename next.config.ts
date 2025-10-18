import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    const iconsPath = path.resolve(__dirname, "src/assets/icons");

    const oneOfRule = (config.module.rules as any[]).find(
      (rule) => typeof rule === "object" && Array.isArray((rule as any).oneOf),
    ) as any;

    const oneOf = oneOfRule?.oneOf as any[] | undefined;

    const findSvgRule = (rules: any[] | undefined) =>
      rules?.find((rule) => rule?.test?.test?.(".svg"));

    const existingSvgRule =
      findSvgRule(oneOf) || findSvgRule(config.module.rules as any[]);

    if (existingSvgRule) {
      // Prevent default handling for icons folder
      if (Array.isArray(existingSvgRule.exclude)) {
        existingSvgRule.exclude.push(iconsPath);
      } else if (existingSvgRule.exclude) {
        existingSvgRule.exclude = [existingSvgRule.exclude, iconsPath];
      } else {
        existingSvgRule.exclude = [iconsPath];
      }
    }

    const urlSvgRule = {
      test: /\.svg$/i,
      include: [iconsPath],
      resourceQuery: /url/,
      // Reuse type from existing rule if present, default to asset
      type: existingSvgRule?.type ?? "asset",
      generator: existingSvgRule?.generator,
      parser: existingSvgRule?.parser,
    } as any;

    const svgrRule = {
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      include: [iconsPath],
      resourceQuery: { not: [/url/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            titleProp: true,
            ref: true,
            exportType: "named",
            namedExport: "ReactComponent",
            svgoConfig: {
              plugins: [
                "preset-default",
                { name: "removeDimensions", active: true },
              ],
            },
          },
        },
      ],
    } as any;

    if (oneOf) {
      oneOf.unshift(svgrRule);
      oneOf.unshift(urlSvgRule);
    } else {
      config.module.rules.push(urlSvgRule, svgrRule);
    }

    return config;
  },
};

export default nextConfig;
