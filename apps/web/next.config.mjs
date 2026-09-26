/** @type {import('next').NextConfig} */
const isStandalone = process.env.NEXT_PRIVATE_STANDALONE === 'true';

const nextConfig = {
  ...(isStandalone ? { output: 'standalone' } : {}),
};

export default nextConfig;
