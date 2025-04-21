import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/twitteritto-bandito.appspot.com/o/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/twitteritto-bandito.firebasestorage.app/o/**",
      },
    ],
  },
};

export default nextConfig;
