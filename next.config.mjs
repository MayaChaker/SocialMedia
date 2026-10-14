/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Product photographs are served at a higher quality than the default 75.
  images: { qualities: [75, 90] },

  async redirects() {
    return [{ source: "/our-story", destination: "/about", permanent: true }];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
