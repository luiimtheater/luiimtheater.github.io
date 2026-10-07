# 雷音劇坊 Lui Im Theater — Website V1

這是雷音劇坊 GitHub Pages 第一版網站，可直接上傳至 `luiimtheater/luiimtheater.github.io`。

## 檔案
- `index.html`：首頁
- `schedule.html`：完整行事曆
- `productions.html`：作品
- `people.html`：團隊
- `styles.css`：網站樣式
- `script.js`：輪播、活動、月曆功能
- `data/events.json`：活動資料
- `.pages.yml`：Pages CMS 後台設定
- `assets/images/`：Logo、主視覺、後台照與作品照

## 上傳到 GitHub
1. 進入 `luiimtheater.github.io` repository。
2. 按 `Add file` → `Upload files`。
3. 將此資料夾內的所有檔案與資料夾上傳到 repository 根目錄。
4. Commit changes。
5. 到 `Settings` → `Pages`，Source 選 `Deploy from a branch`，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
6. 等待約 1–3 分鐘後開啟 `https://luiimtheater.github.io/`。

## 更新行事曆（Pages CMS）
網站已包含 `.pages.yml`。登入 https://app.pagescms.org/ 並連接此 repository 後，會看到「活動行事曆」。新增資料後儲存，`data/events.json` 會更新，首頁與行事曆頁會同步讀取。

活動欄位：活動名稱、日期、時間、結束日期、類型、地點、簡介、活動連結、首頁精選、公開顯示。

## 團隊照片
目前人物頁使用舊 Wix 官網公開的圖片網址作為第一版過渡；陳信宏因舊站圖片異常，目前使用文字佔位。建議之後把人物照片下載／重新上傳至 `assets/images/team/`，避免日後關閉舊站時照片失效。
