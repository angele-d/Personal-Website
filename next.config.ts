import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    // Using @ instead of ../../
    includePaths: [path.join(__dirname, "app/styles")],
    // Automatically import variables and math module in every SCSS file
    additionalData: `@use "sass:math"; @import "${path.join(__dirname, "app/styles/_variables.scss")}";`
  }
};

export default nextConfig;
