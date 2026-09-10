# fixhouse-3d

## 專案簡介

FixFlow 3D 是 MVP 版本的互動式 3D 水電教學網站，第一版僅完整實作「馬桶一直流水」案例，其他問題顯示 `Coming Soon`。

## 本地開發

```bash
npm install
npm run dev
```

瀏覽器開啟：

- `http://localhost:3000`
- `http://localhost:3000/problems`

## GitHub Pages 部署

本專案已設定 GitHub Pages 自動部署，使用 GitHub Actions 進行靜態輸出後發佈。

### 1) 啟用 GitHub Pages

1. 到 GitHub 專案頁面 `Settings` → `Pages`
2. 選擇 `Source` 為 `GitHub Actions`
3. 推送到 `main` 分支後會自動觸發部署

### 2) URL 路徑

專案頁網址會以 repository name 為 base path（例如 `https://<user>.github.io/<repo-name>/`）輸出。

### 3) 手動觸發部署

在 Actions 頁面可手動執行 `Deploy Next.js site to GitHub Pages` workflow。

## 專案腳本

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### 發佈流程說明

GitHub Actions 會在建置時注入：

- `NEXT_PUBLIC_BASE_PATH=/<repository-name>`

並輸出到靜態目錄 `out/` 供 GitHub Pages 發佈。
