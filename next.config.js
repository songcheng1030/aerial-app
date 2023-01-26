const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  async redirects() {
    return [{ source: '/', destination: '/summary', permanent: false }]
  },
  images: {
    domains: ['cdn.cdnlogo.com', 'lh3.googleusercontent.com']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
})
