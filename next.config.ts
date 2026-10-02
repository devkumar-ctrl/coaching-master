import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  
  
  //  experimental: {
   
  // },
  //  transpilePackages: ["@myorg/my-package"],
  //  redirects: async () => [
  //    {
  //      source: '/old-path',
  //      destination: '/new-path',
  //      permanent: true,    
  /* config options here */
};

export default nextConfig;
