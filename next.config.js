/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'alchemy.mypinata.cloud', 'ipfs.io', 'ipfs.alchemy.com'],
  },
}

module.exports = nextConfig 