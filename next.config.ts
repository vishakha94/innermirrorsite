import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/structure/:path*",
        destination: "/studio/structure/:path*",
        permanent: false,
      },
      {
        source: "/news/seminar-medanta-1",
        destination: "/news/seminar-medanta",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
