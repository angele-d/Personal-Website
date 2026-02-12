const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  sassOptions: {
    loadPaths: [path.join(__dirname)],
    prependData: '@use "app/styles/_variables" as *;',
  },
}

module.exports = nextConfig
