雷音劇坊官網｜原設計恢復修正版 v8

這次不再另創 Header。

【從舊聊天紀錄恢復的設計】
1. V25 booking.html 原本有三種合作：
   - 劇目演出
   - 校園講座
   - 布袋戲示範與體驗
2. 劇目區原本要求像「菜單」，方便邀演單位快速看。
3. 原文意包含：
   「節目內容與演出長度可依活動流程、場地、觀眾與技術條件洽談調整。」
4. V25 原本就有 2026.10.13 國立宜蘭大學
   「布袋戲行當道具使用」案例。
5. 宜蘭案例原聊天紀錄顯示用了 4 張活動照片，
   並有「布袋戲小知識｜什麼是砌末？」。
6. 《豬八戒痟娶某》應是新增的第二個案例，不是取代宜蘭大學。
7. 演出足跡的活動回顧併回年度項目，只用小 ↗。
8. 活動 Banner 與回顧照片不裁切、不固定高度。

【Header 修法】
booking / archive / 兩個 review 頁：
- 不再寫新的 Header HTML。
- sync-home-header.js 會直接 fetch index.html，
  複製「首頁現在正在用的 Header」。
- 連首頁 stylesheet 與外部 script 也會同步載入。
- 因此 Logo、導覽、間距、手機版都以首頁原碼為準。

請不要再覆蓋 index.html、styles.css、script.js。

【宜蘭大學 4 張照片】
目前可以實際取回的只有兩個講座視覺附件：
- 布袋戲行當道具講座海報.png
- 布袋戲行當・道具使用講座.png

聊天紀錄確認 V25 當時確實用了 4 張活動照片，
但那 4 張原始照片檔目前不在本次掛載檔案中，
所以這次沒有假造照片。

booking.html 會先嘗試讀：
assets/images/booking/yilan-01.webp
assets/images/booking/yilan-02.webp
assets/images/booking/yilan-03.webp
assets/images/booking/yilan-04.webp

如果你 GitHub 上 V25 舊資產還留著，會直接顯示原 4 張。
若前兩張不存在，會 fallback 到本包的 recovered reference 圖；
第 3、4 張不存在則自動隱藏。

【易芊照片】
新照片已放：
assets/images/team/cian-yi.webp
assets/images/team/yi-cian.webp
assets/images/team/cian_yi.webp
assets/images/team/yi_cian.webp

people-photo-fix.js 可找到「易芊 / Cian Yi」卡片並換圖。
但因本次拿不到 people.html 的完整原始碼，
我沒有重建 people.html，避免再把團隊頁與 Header 改壞。

若現有 people.html 已有可載入外部 JS 的位置，只需加：
<script src="people-photo-fix.js" defer></script>

【上傳】
根目錄：
- booking.html
- archive.html
- review-zhubajie-dadaocheng-2026.html
- review-qingminglong-dadaocheng-2026.html
- sync-home-header.js
- page-fixes.css
- people-photo-fix.js
- zhubajie-*.webp
- qingming-*.webp

資料夾合併：
- assets/images/booking/
- assets/images/team/

不要覆蓋：
- index.html
- styles.css
- script.js
