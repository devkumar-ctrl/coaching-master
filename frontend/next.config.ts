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
    // The /api/* rewrite is compiled into the build's routes manifest, so a
    // missing NEXT_PUBLIC_API_URL is baked in permanently and cannot be fixed
    // without a rebuild. Falling back to localhost looks harmless but silently
    // produces a build that passes and then serves HTTP 500 on every /api/*
    // route in production, because the Netlify runtime cannot reach it.
    // Fail the build instead so the misconfiguration is impossible to ship.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          "NEXT_PUBLIC_API_URL is not set. It must point at the backend origin " +
            "(e.g. https://your-backend.vercel.app) and is set in netlify.toml " +
            "[build.environment]. See frontend/.env.example.",
        );
      }
      // Local development: backend runs on :4000.
      return [
        {
          source: "/api/:path*",
          destination: `http://localhost:4000/api/:path*`,
        },
      ];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;