import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dpavjxpr6/image/upload/**", // BU TO'G'RI YO'L
      },
    ],
  },
};

export default nextConfig;
