# Google Search Console 上線步驟

網站網址：`https://luiimtheater.github.io/`

1. 前往 Google Search Console，新增「網址前置字元」資源：`https://luiimtheater.github.io/`。
2. 建議使用「HTML 檔案」驗證。Google 會提供一個 `googlexxxxxxxx.html` 檔案。
3. 將 Google 提供的驗證檔直接上傳到此 repository 根目錄（與 `index.html` 同一層），等待 GitHub Pages 更新後再回 Search Console 按「驗證」。
4. 驗證成功後，到「Sitemaps」提交：`https://luiimtheater.github.io/sitemap.xml`。
5. 到「網址審查」輸入首頁 `https://luiimtheater.github.io/`，按「要求建立索引」。作品頁亦可另外要求索引：`https://luiimtheater.github.io/productions.html`。

## 本版已加入
- sitemap.xml
- robots.txt
- canonical URL
- Google 可讀的頁面標題與 description
- Open Graph / 社群分享圖片
- JSON-LD 結構化資料（劇團、作品、10/23 演出）

注意：Google 的驗證 HTML 檔必須使用 Search Console 實際提供的檔案，不能自行預先建立。
