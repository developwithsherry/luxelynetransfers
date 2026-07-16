/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⚡ Ignore ESLint during builds
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bfzshwwcifmfxvaxdedm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  typescript: {
    // ⚡ Ignore TypeScript errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
