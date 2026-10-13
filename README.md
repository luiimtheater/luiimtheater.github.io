# 雷音劇坊官網 V22

本版針對大稻埕國際藝術節圖片無法顯示做部署層修正。

四張活動圖片改為網站根目錄 JPG：
- dadaocheng-main-wide.jpg
- dadaocheng-main-mobile.jpg
- dadaocheng-qingming.jpg
- dadaocheng-zhubajie.jpg

這樣上傳 GitHub 時不必依賴新增的深層資料夾路徑，降低漏傳 `assets/images/events/` 新檔的機率。請將解壓縮後的所有檔案（包含四張 JPG）一起上傳到 repository 根目錄並 Commit。


## V23
- 首頁「近期動向」僅保留一個 2026大稻埕國際藝術節系列活動主視覺。
- 主視覺圖片本身可點擊進入系列活動頁，不再另設 CTA 按鈕。
- Schedule 頁將「系列活動」與「即將到來」合併為單一區塊，避免同一檔活動重複出現。
- 行事曆仍保留各實際活動日期；點進系列活動頁後再看旗艦演出與演出互動DIY場個別 Banner、介紹與購票／報名。
