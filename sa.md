# FixFlow 3D - MVP System Analysis

> 來源：用戶提供之 SA 文件（MVP v0.1）

## 1. 專案資訊
- 專案名稱：FixFlow 3D
- Repository：`fixflow-3d`
- 類型：純前端 3D 水電教學網站
- 版本：MVP v0.1
- 文件：System Analysis

## 2. MVP 目標
第一階段只驗證「**3D 模型 + 互動步驟是否能提升一般使用者理解水電問題與故障位置**」。

完全實作項目：
- `馬桶一直流水`（problem slug：`toilet-running-water`）

其餘問題僅作為目錄/選單項目展示與 `Coming Soon` 狀態：
- 首頁問題列表
- 設備選單
- 搜尋結果
- Coming Soon 頁面（不含實際教學內容）

## 3. 技術限制 / 禁用項目
MVP 全部在前端執行，不使用：
- Backend
- Database
- API Server
- Login / User Account
- Supabase / Firebase / PostgreSQL / CMS

可使用：
- TypeScript
- JSON
- Static Assets
- GLB Models

## 4. 技術棧（建議）
- Next.js
- React
- TypeScript
- Three.js
- React Three Fiber
- Drei

## 5. MVP 核心案例
- 流程：`浴室 > 馬桶 > 馬桶一直流水`
- Slug：`toilet-running-water`
- 英文 ID：`toilet-running-water`

## 6. 頁面規劃
- `/`：首頁（問題入口）
- `/problems`：問題列表
- `/problem/toilet-running-water`：完整 3D 教學
- `/problem/[slug]`：其餘問題顯示 `Coming Soon`

## 7. 首頁/問題列表需求
- 首頁顯示問題分類入口（建議：水類 / 電類）
- 列出 10 個題目（僅 `馬桶一直流水` 可進入）
- 其餘題目以 `Coming Soon` 呈現

問題清單（共 10 筆）：
- 馬桶一直流水（Available）
- 水龍頭漏水（Coming Soon）
- 洗手台堵塞（Coming Soon）
- 馬桶堵塞（Coming Soon）
- 蓮蓬頭水壓不足（Coming Soon）
- 水管漏水（Coming Soon）
- 熱水器沒有熱水（Coming Soon）
- 插座沒電（Coming Soon）
- 跳電（Coming Soon）
- 燈不亮（Coming Soon）

## 8. 3D 教學頁需求
- 兩欄（Desktop） / 上下（Mobile）版型
- 左（或上）：3D Viewer
- 右（或下）：問題資訊 / 診斷步驟 / 操作按鈕
- 流程：介紹問題 → 教學步驟 → Yes/No 判斷 → 診斷結果
- 低風險教學，顯示安全提示

## 9. 3D Model 與互動
- 首版只載入 `Toilet`（不做完整浴室）
- 模型關鍵節點：
  - `toilet_body`
  - `tank`
  - `tank_lid`
  - `fill_valve`
  - `float`
  - `flapper`
  - `flush_valve`
  - `shutoff_valve`
- `Fill Valve`、`Float`、`Flapper`、`Shutoff Valve` 為必要可單獨 highlight 零件
- MVP Viewer 功能：
  - Rotate
  - Zoom
  - Highlight
  - Focus
  - Reset Camera
- 排除功能：
  - Exploded View / 物理模擬 / 水流模擬 / 動畫拆裝 / AR / VR

## 10. 診斷流程（馬桶一直流水）
簡化 Decision Tree：
1. 打開水箱上蓋
2. 觀察水是否持續流入馬桶（是/否）
3. 若「是」→ 檢查止水皮（Flapper）
4. 問：止水皮是否歪斜、變形或未密合（是/否）
5. 若是 → 結果 A（止水皮原因）
6. 若否 → 檢查浮球（Float）
7. 若浮球異常 → 結果 B（浮球原因）
8. 浮球正常但仍持續進水 → 結果 C（進水閥原因）

原因排序：
1. 止水皮
2. 浮球
3. 進水閥

## 11. 教學資料（建議資料結構）
放置於 `src/data/`，例如：
- `src/data/problems.ts`
- `src/data/toilet-running-water.ts`

### Problems
每題包含：
- `id`、`title`、`category`、`device`、`available`

### Tutorial
每個案例包含：
- `id`、`title`、`riskLevel`
- `causes`：3 項
- `steps`：包含 `id`、`title`、`description`、`targetPart`

## 12. 狀態管理
- 不使用 Redux
- 使用 `React.useState` 管理：
  - `currentStep`
  - `selectedPart`
  - 使用者回答（Yes/No）

## 13. 專案建議目錄
- `app/page.tsx`
- `app/problems/page.tsx`
- `app/problem/[slug]/page.tsx`
- `components/three/ToiletModel.tsx`
- `components/three/ModelViewer.tsx`
- `components/three/CameraController.tsx`
- `components/ProblemCard.tsx`
- `components/TutorialPanel.tsx`
- `components/TutorialStep.tsx`
- `components/ComingSoon.tsx`
- `data/problems.ts`
- `data/toilet-running-water.ts`
- `public/models/toilet.glb`
- `types/problem.ts`

## 14. 完成條件（MVP Definition of Done）
- 首頁完成
- 問題列表完成（10 題）
- Coming Soon 狀態完成
- Toilet 3D 載入完成
- Rotate / Zoom / Camera Reset 完成
- 零件 Highlight 完成
- `馬桶一直流水` 介紹完成
- 3 個可能原因與診斷步驟完成
- Yes/No 診斷流程完成
- 診斷結果頁面完成
- 安全提示完成
- Mobile 響應式完成

## 15. 開發步驟拆分（可直接執行）
1. 專案基礎建置
   - 建立 Next.js + TypeScript 專案
   - 設定路由骨架（`/`, `/problems`, `/problem/[slug]`）

2. 資料層與靜態內容
   - 建立 `src/data/problems.ts`
   - 建立 `src/data/toilet-running-water.ts`
   - 建立型別 `types/problem.ts`

3. 首頁與問題列表
   - 首頁：類別入口 + 熱門/問題快速入口
   - `ProblemCard` 呈現 `available` 狀態
   - `Coming Soon` 行為串接到詳細頁

4. 問題頁與導覽邏輯
   - 實作 `/problem/[slug]` 頁面
   - `available === true` 進入教學頁，否則顯示 Coming Soon
   - 確保 `toilet-running-water` 路由可進入

5. 3D Viewer 基礎
   - 安裝/加入 React Three Fiber + Drei
   - `ModelViewer` 載入 `public/models/toilet.glb`
   - 實作 Camera 控制（Rotate / Zoom / Reset）

6. Highlight 與步驟串接
   - 建立 `selectedPart` 流程
   - `mesh.name` 對應高亮（如 `flapper`, `float`, `fill_valve`）
   - 其餘 mesh 降透明/低亮度

7. 教學流程實作
   - 建立 `TutorialPanel` 與 step UI（問題資訊、問題、描述、按鈕）
   - 串接 Yes/No 選項與步驟轉移
   - 呈現診斷結果（A/B/C）
   - 顯示安全提示

8. RWD 與收斂
   - Desktop / Mobile 版型對應
   - 基礎 accessibility 檢查（可點擊、可讀性）
   - 測試完整流程：首頁 → 列表 → 教學 → highlight → 診斷結果

9. 後續加值（MVP 後）
   - 補齊其他問題資料與步驟模板
   - 逐步複用 `problem + tutorial` 結構擴充新案例

