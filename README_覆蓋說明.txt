雷音劇坊官網統一修正版 v7

這包針對你截圖中的問題：

1. HEADER
- archive.html、booking.html、兩個活動回顧頁，全部改成與首頁截圖相同方向：
  左側白色雷音劇坊標誌
  首頁 Home / 近期動向 Schedule / 劇目 Productions / 合作 Booking /
  演出足跡 Archive / 團隊 Team / 媒體 Media / 關於 About / 聯絡 Contact / EN
- 不再使用紅色「雷」方塊版 Header。
- 窄螢幕時導覽可橫向滑動，不會擠壓或換行跑版。

2. 易芊行政團隊照片
- 已用你剛提供的新照片重新輸出。
- 為避免目前 people.html 實際引用檔名不同，已同時提供多個常用別名：
  cian-yi.webp / cian-yi.jpg / yi-cian.webp / yi-cian.jpg /
  yi-cian-profile.webp / yi-cian-profile-4x5.webp / cian-yi-card.webp
- 同一組也放在 assets/images/ 內。
- people-photo-fix.js 是保險用小修補程式：若 people.html 有載入它，會自動找到「易芊 / Cian Yi」卡片並換成 assets/images/cian-yi.webp。
- 因目前沒有取得你線上 people.html 原始碼，本包不覆蓋 people.html，以免破壞既有團隊頁。

3. 活動回顧照片
- review-zhubajie-dadaocheng-2026.html
- review-qingminglong-dadaocheng-2026.html
- Banner 改為 width:100%; height:auto; object-fit:contain，不裁切。
- 下面照片改為自然比例兩欄 Grid，手機單欄；不強制固定高度、不裁切、不會再被拉到跑版。

4. 演出足跡
- 活動回顧不獨立占一區。
- 回顧只放在年度項目後的小 ↗。
- 保留既有年度清單。

5. 合作頁
- Header 同首頁。
- 內容排版改為響應式，圖片使用自然比例。

上傳方式：
把本 ZIP 內容依原目錄上傳到 GitHub Repository。
根目錄覆蓋：
- archive.html
- booking.html
- review-zhubajie-dadaocheng-2026.html
- review-qingminglong-dadaocheng-2026.html
- zhubajie-*.webp
- qingming-*.webp
- 易芊照片別名檔（若根目錄已有同名就覆蓋）

assets/images/ 也整個合併上傳，尤其：
- assets/images/luiim-header-logo.png
- assets/images/cian-yi.webp 等易芊照片別名

people.html：
目前請不要用任何新 people.html 覆蓋。
先把照片別名上傳；如果現有 people.html 引用其中一個常用檔名，照片會直接更新。
若仍未更新，再把現行 people.html 原檔提供給我，我只改易芊 img src，不改其他團隊內容。
