# Sportify｜運動社群與場館預約平台（前端）

> 整合「場館預約、揪團社群、運動商城、課程報名、金流結帳」的一站式運動生活平台。
> 本儲存庫為 **前端專案（Next.js App Router）**，後端 API 請見下方 [相關儲存庫](#相關儲存庫)。

> 📌 本專案為多人協作團隊專題，原專案託管於 [Leo-Chang-97/sportify-team-frontend](https://github.com/Leo-Chang-97/sportify-team-frontend)。
> 此儲存庫為本人（[Rean2127](https://github.com/Rean2127)）的作品集副本，內容對齊團隊最終版本。

<!-- 建議在此放一張首頁或主要功能的截圖 / GIF -->
<!-- ![Sportify 首頁](./docs/screenshots/home.png) -->

| 項目 | 連結 |
| --- | --- |
| 線上 Demo | https://sportify-team-frontend.onrender.com |
| 後端 API Repo | https://github.com/Rean2127/sportify-team-backend |
| 原始團隊專案 | https://github.com/Leo-Chang-97/sportify-team-frontend |

---

## 專案簡介

Sportify 是一個團隊協作開發的全端專案，目標是讓使用者能在同一個平台完成與運動相關的各種需求：

- 搜尋並 **預約運動場館**（依運動類型、地區、日期與時段）
- **建立或加入運動團隊**，進行揪團、行事曆共享與團隊訊息溝通
- 在 **運動商城** 選購商品、加入購物車與收藏、線上結帳
- 瀏覽並 **報名運動課程**
- 完整的 **會員中心**（個人資料、頭像裁切上傳、各類訂單與收藏紀錄）
- **後台管理系統**（場館、時段、商品、訂單管理）

此儲存庫涵蓋整個前端介面與串接邏輯，採 Next.js App Router 架構，並串接自建的 Express + Prisma + MySQL 後端 API。

---

## 技術棧

| 分類 | 技術 |
| --- | --- |
| 框架 | **Next.js 15**（App Router、Turbopack）、**React 19** |
| 樣式 | **Tailwind CSS 4**、shadcn/ui、Radix UI、tw-animate-css |
| 狀態管理 | **Jotai**、React Context API |
| 資料請求 | **SWR**、Axios、Fetch |
| 表單 / 驗證 | **Zod**、react-day-picker |
| 身分驗證 | **JWT**（localStorage）、**Firebase Authentication**（Google 登入） |
| 資料視覺化 / 互動 | **Recharts**（圖表）、**@tanstack/react-table**（後台資料表）、**dnd-kit**（拖曳排序）、**Leaflet / react-leaflet**（地圖）、**Embla**（輪播）、**Framer Motion**（動畫） |
| 圖片處理 | react-easy-crop（頭像裁切） |
| 通知 / 互動 | Sonner（Toast）、SweetAlert2 |
| 金流 | LINE Pay、綠界 ECPay（由後端串接，前端負責導轉與結果頁） |
| 開發工具 | ESLint、Prettier、next-themes（深淺色主題） |

---

## 主要功能模組

- **會員與身分驗證**：Email 註冊/登入、Google 第三方登入、JWT 權限控管、登入狀態持久化。
- **場館預約**：場館搜尋、場地時段表（time slot）顯示與選位、預約結帳與成功頁。
- **揪團社群**：建立團隊、瀏覽團隊、加入申請審核、團隊成員管理、團隊行事曆標記、團隊訊息。
- **運動商城**：商品列表與詳情、購物車、商品收藏、結帳與配送方式、訂單紀錄。
- **課程報名**：課程列表、課程報名與付款流程。
- **會員中心**：個人資料編輯、頭像裁切上傳、場館/揪團/商城/課程/收藏等各類資料頁。
- **後台管理**：場館、場地、時段、商品、訂單等後台 CRUD（含資料表排序、分頁、篩選）。

---

## 專案架構

```
frontend/sportify-team-frontend
├─ app/                  # App Router 頁面（依功能分域：auth、member、venue、team、shop、course、admin）
│  ├─ layout.js          # 全域 Provider（Auth / Venue / Theme）與字型、Toaster
│  ├─ firebase.js        # Firebase 前端初始化（Google 登入）
│  ├─ login / register   # 登入、註冊（含 _components 區域元件）
│  ├─ member/            # 會員中心（含獨立 layout 與各資料頁）
│  ├─ venue/             # 場館預約（含 reservation / payment / success）
│  ├─ team/              # 揪團社群（含 ourteam / create）
│  ├─ shop/              # 商城（含 order / payment / [id]）
│  ├─ course/            # 課程報名
│  └─ admin/             # 後台管理（venue / shop）
├─ components/           # 共用元件
│  ├─ ui/                # shadcn/ui 基礎元件（button、select、slider…）
│  ├─ card/              # 各類卡片（team、product、course、center、member…）
│  └─ admin/             # 後台表單元件
├─ contexts/             # React Context（auth-context、venue-context）
├─ hooks/                # 自訂 hooks
├─ lib/                  # 共用邏輯（api-path 等）
├─ utils/                # 工具函式（cropImage 等）
├─ style/                # 全域樣式
└─ public/               # 靜態資源
```

### 身分驗證流程（重點設計）

- 以 React Context（`contexts/auth-context.js`）封裝 `login / register / logout / googleLogin / updateUserProfile / uploadAvatar`，並透過自訂 hook `useAuth()` 供全站取用。
- 登入成功後將 JWT 存入 `localStorage`，後續請求以 `Authorization: Bearer <token>` 夾帶；首次載入會呼叫 `/auth/verify` 還原登入狀態（以 `hasInitialized` 避免重複驗證）。
- Google 登入：前端取得 Firebase `idToken` 後交給後端 `/auth/firebase-login` 驗證並換發自家 JWT。
- 頭像上傳使用 `FormData` 以 multipart 形式上傳至後端，並於前端用 react-easy-crop 完成裁切。

---

## 本機開發

### 需求環境

- Node.js 18+（建議 20 LTS）
- 已啟動的後端 API 服務（見 [相關儲存庫](#相關儲存庫)）

### 安裝與啟動

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器（http://localhost:3000）
npm run dev

# 建置與啟動正式版
npm run build
npm run start
```

### 環境變數

於專案根目錄建立 `.env.local`（此檔已被 `.gitignore` 忽略，請勿提交）：

```env
# Firebase（Google 登入，皆為前端公開用的 NEXT_PUBLIC_*）
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> 後端 API 位址目前定義於 `lib/api-path.js`（預設 `http://localhost:3005`）。
> 若要部署，建議改用環境變數（例如 `NEXT_PUBLIC_API_URL`）並於 `next.config.mjs` 的 `images.remotePatterns` 加入正式網域。

---

## 相關儲存庫

| 儲存庫 | 說明 |
| --- | --- |
| [sportify-team-backend](https://github.com/Rean2127/sportify-team-backend) | 後端 API：Express + Prisma + MySQL、JWT 驗證、Firebase Admin、LINE Pay / 綠界金流、圖片上傳（multer） |
| [原始團隊前端專案](https://github.com/Leo-Chang-97/sportify-team-frontend) | 多人協作之原始專案 |

---

## 團隊分工

本專案為多人協作之團隊專題，以下為本人負責之項目。

**我（[Rean2127](https://github.com/Rean2127)）主要負責：**

- 會員的**註冊、登入、登出**流程
- **權限管理**（JWT 驗證與登入狀態控管）
- **會員中心**資料編輯
- **頭像上傳與裁切**功能
- 各項服務的**使用記錄管理**（場館 / 揪團 / 商城 / 課程 / 收藏等資料頁）

> 對應程式：`contexts/auth-context.js`、`app/login`、`app/register`、`app/member/**`、頭像裁切 `utils/cropImage.js` 與 `components/ui/image-crop-dialog.jsx`。

---

## 授權

本專案僅供學習與作品集展示用途。
