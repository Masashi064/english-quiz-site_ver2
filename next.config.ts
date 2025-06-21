// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'], // ✅ WebPを優先して使うよう指定
  },
};

export default nextConfig;
