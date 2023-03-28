/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/test",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "next/font/google", options: { subsets: ["latin"] } },
    ],
  },
};

module.exports = nextConfig;
