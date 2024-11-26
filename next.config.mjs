/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uiparadox.co.uk",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
