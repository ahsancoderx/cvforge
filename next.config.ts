import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      mammoth: 'mammoth/mammoth.browser',
      canvas: { browser: './empty-module.js' },
    },
  },

  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      mammoth: 'mammoth/mammoth.browser',
      ...(isServer
        ? { 'pdfjs-dist/legacy/build/pdf': false }
        : {}),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      zlib: false,
      buffer: false,
    };

    return config;
  },

  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;