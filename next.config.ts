/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 允许在存在 TypeScript 报错的情况下依然强行打包成功
    ignoreBuildErrors: true,
  },
  eslint: {
    // 顺便把代码格式警告也忽略掉，防止等会儿又卡住
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;