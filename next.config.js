/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        // This regex ensures the headers apply to every single page and asset
        source: '/(.*)', 
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
