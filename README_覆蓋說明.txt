雷音劇坊｜演出足跡恢復＋豬八戒 Banner 修正版 v5

這版修正前一版造成的問題：

1. archive.html
- 恢復 2020–2026 完整演出足跡，不再只剩兩張活動回顧卡。
- 依年份分組，保留「日期 → 活動名稱 → 地點」邏輯。
- 手機版同樣改成日期、活動名稱、地點由上到下排列。
- 活動回顧只放在上方當入口，不取代完整歷史紀錄。
- 沒有大型「查看回顧」按鈕；整張卡可點，標題旁只留 ↗。
- 已過期的「近期活動」不再出現。
- 不放「合作形式」按鈕。

2. review-zhubajie-dadaocheng-2026.html
- Banner 不再使用體驗工作坊照片。
- 頁面會讀取原官網／售票頁使用的：
  assets/images/dadaocheng-zhubajie.jpg
- 若你的舊站是把該檔放在根目錄，也會再嘗試：
  dadaocheng-zhubajie.jpg
- 本更新包不另外偽造或替換那張主視覺；請保留 GitHub 原本的 dadaocheng-zhubajie.jpg。
- 5 張體驗照片只用於下方「現場紀錄」。

上傳方式：
- archive.html → 覆蓋 Repository 根目錄原檔
- review-zhubajie-dadaocheng-2026.html → 覆蓋同名檔
- assets/images/zhubajie-experience-01.webp ～ 05.webp → 上傳至 assets/images/
- assets/images/qingming-banner.webp → 若 GitHub 已有可略過

重要：
請不要刪除 GitHub 原本的 assets/images/dadaocheng-zhubajie.jpg。
如果 Repository 裡沒有這個檔案，請把你售票頁原圖上傳給 ChatGPT，我再幫你補進更新包；目前不會用錯誤的體驗照片冒充它。
