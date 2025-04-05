import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://coherebuilder.vercel.app",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_COHERE_API_KEY: process.env.NEXT_PUBLIC_COHERE_API_KEY,
  },
  // Optimize builds for Vercel
  optimizeFonts: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  // Enable React 18 server components
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Add image domains for optimization
  images: {
    domains: ['res.cloudinary.com', 'github.com', 'avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Increase serverless function timeout (for Cohere API calls)
  serverRuntimeConfig: {
    // Will only be available on the server side
    maxDuration: 60, // 60 seconds
  },
  experimental: {
    // Enable server actions for form submissions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
