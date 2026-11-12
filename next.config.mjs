// 從 NEXT_PUBLIC_API_URL 解析出後端圖片網域（部署時用），開發時 fallback 到 localhost:3005
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'
let backendImagePattern = null
try {
  const u = new URL(apiUrl)
  backendImagePattern = {
    protocol: u.protocol.replace(':', ''),
    hostname: u.hostname,
    ...(u.port ? { port: u.port } : {}),
    pathname: '/**',
  }
} catch {
  backendImagePattern = null
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 部署時略過 ESLint 阻擋（lint 為開發期檢查，不作為正式 build 的門檻）
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // 後端提供的所有圖片（頭像、商品、場館、課程、團隊）皆從此網域
      ...(backendImagePattern ? [backendImagePattern] : []),
      // 以下保留 localhost 供本機開發
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
