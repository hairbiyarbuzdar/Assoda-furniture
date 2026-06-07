/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        // Placeholder furniture photos used by the sample data layer.
        // Remove once the real Cloudinary-backed catalog is live.
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        // Curated editorial photos (hero, craftsmanship, collections).
        // Swap for owned/Cloudinary assets later.
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
