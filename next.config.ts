/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {
    resolveAlias: {
      // Use browser build of mammoth (not the Node.js build)
      'mammoth': 'mammoth/mammoth.browser',
      // pdfjs tries to use canvas — ignore it in browser
      'canvas': { browser: './empty-module.js' },
    },
  },

  // Webpack fallback (for --webpack flag or CI builds)
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    if (isServer) {
      config.resolve.alias['pdfjs-dist/legacy/build/pdf'] = false;
    }
    config.resolve.alias['mammoth'] = 'mammoth/mammoth.browser';
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

module.exports = nextConfig;