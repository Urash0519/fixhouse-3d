# FixFlow 3D

用可旋轉的 3D 示意、短篇原理章節與互動檢查，看懂 10 種常見居家水電問題。

正式網站：https://urash0519.github.io/fixhouse-3d/

## 已完成的內容

- 10 個完整案例：馬桶流水、水龍頭漏水、洗手台堵塞、馬桶堵塞、淋浴水量不足、水管漏水、熱水器沒有熱水、插座沒電、跳電、燈不亮。
- 9 種以 TypeScript 建立的 3D 設備示意模型；共用馬桶模型呈現不同症狀。
- 旋轉、縮放、聚焦、視角重設、剖面／組合檢視、正常／異常比較。
- 可暫停、拖曳的動畫時間軸，3 個原理章節與可點選零件。
- 有安全分支的 Yes/No 檢查、無法確認、返回上一步、重新開始。
- 檢查摘要下載、本機留存結果與已留存篩選。結果留存代表完成觀察，不表示設備已修復。
- 關鍵字搜尋、水／電分類、手機版、鍵盤操作、減少動態偏好、WebGL 不可用時的文字替代。
- GitHub Pages 子目錄靜態部署與自動測試。

互動理念參考 [MetaBear 互動學院](https://metabear.io/orderflow/)：一次理解一件事、用畫面看因果、自由暫停與重看。介面、文案和程序模型皆在本專案實作，未使用對方素材。

## Docker 開發（不需本機 Node.js）

只需要已安裝的 Docker Desktop：

```sh
docker compose up --build app
```

開啟 http://localhost:3000 。程式碼透過 bind mount 即時更新；node_modules 與 Next 快取放在 Docker volumes。

依賴有更新時：

```sh
docker compose run --rm app npm ci
```

結束開發：

```sh
docker compose down
```

## 驗證與靜態建置

```sh
docker compose run --rm app npm run lint
docker compose run --rm app npm test
```

以 GitHub Pages 的子目錄設定建置，在 PowerShell 執行：

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/fixhouse-3d"
docker compose run --rm app npm run build
docker compose --profile test run --rm browser-tests
```

建置產物為工作目錄的 out/。瀏覽器測試使用官方 Playwright Docker 映像與獨立依賴 volume，不安裝本機 Chromium；測試會啟動容器內的靜態預覽。測試完成後可清除環境變數，讓開發網址回到根路徑：

```powershell
Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

如需手動預覽 out/，保留相同的 NEXT_PUBLIC_BASE_PATH：

```sh
docker compose run --rm --service-ports app npm run preview
```

## 自動部署

main 分支 push 會執行 .github/workflows/github-pages.yml：

1. npm ci，以 lockfile 安裝依賴。
2. ESLint、所有診斷分支測試。
3. TypeScript 檢查與 10 個教學的靜態輸出。
4. Playwright 驗證桌機、手機、3D 控制、診斷、下載、本機留存與 WebGL 替代模式。
5. 全部通過後，發布到 GitHub Pages。

Pages Source 使用 GitHub Actions。PR 執行驗證但不部署。basePath 由儲存庫名稱自動決定；保留 trailingSlash，讓深層路由可直接開啟。

## 程式結構

- app/：首頁、教學目錄、動態教學路由、404、共用樣式。
- src/data/problems.ts：教學入口與搜尋資訊。
- src/data/tutorials.ts：原理章節、安全提示、問題與結果分支、參考資料。
- src/data/parts.ts：模型零件位置、名稱與作用。
- components/three/：程序模型、鏡頭、播放器與降級處理。
- components/ProblemTutorial.tsx：診斷狀態與摘要。
- tests/flow.test.ts：檢查分支可達性、終止、安全與資料一致性。
- tests/site.spec.ts：正式靜態輸出的端到端測試。

技術：Next.js 16、React 19、TypeScript strict、Three.js、React Three Fiber / Drei。純前端，不需要後端、資料庫或登入。3D 為簡化教學模型，非特定廠牌的維修模型；電氣、燃氣與危險狀況以停止操作、記錄資訊和專業轉介為原則。
