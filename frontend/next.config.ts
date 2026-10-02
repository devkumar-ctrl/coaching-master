import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is one half of a monorepo, but there is no root package.json
  // "workspaces" field, so Next.js sees both package-lock.json files, picks the
  // repo root as the workspace root and warns about it. Pinning the tracing
  // root to this directory keeps output file tracing scoped to this app.
  outputFileTracingRoot: process.cwd(),

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;