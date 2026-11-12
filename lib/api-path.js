// 後端 API 位址：優先讀環境變數 NEXT_PUBLIC_API_URL，開發環境 fallback 到 localhost
// 注意：NEXT_PUBLIC_* 會在 build 時內嵌，部署時請於環境變數設定正式後端網址
const BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005').replace(
  /\/$/,
  ''
)

export const SERVER = BASE
export const API_SERVER = `${BASE}/api`
export const API_SERVER_ADMIN = `${BASE}/api/admin`
