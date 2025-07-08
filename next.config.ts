import type { NextConfig } from 'next';
import { withJsxLoc } from '@builder.io/nextjs-plugin-jsx-loc';

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'cdn.builder.io', 'lh3.googleusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withJsxLoc(nextConfig);
