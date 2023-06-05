/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "vercel.com"],
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
}

export default nextConfig
