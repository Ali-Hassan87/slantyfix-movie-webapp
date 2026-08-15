/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {

    qualities: [75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
};

export default nextConfig;
