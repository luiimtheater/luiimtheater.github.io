雷音劇坊官網 v29.17｜觀眾「請戲單」功能

請將以下檔案上傳到 GitHub 專案最外層根目錄並覆蓋：
- styles.css
- script.js
- work-qingminglong.html
- work-guishan.html
- work-crazy-knight.html
- work-xibeiyu.html
- work-kutai.html
- work-yanluo.html
- work-jijiyu.html
- work-chenxiang.html
- work-weizheng.html
- work-zhubajie.html
- work-jinkuixing.html

功能：
1. 11 個劇目頁皆新增「ϟ 請戲單｜我想看這齣」。
2. 跨訪客共用公開計數，頁面顯示「XX 人想看」。
3. 同一瀏覽器同一齣戲原則上只記一次（localStorage）。
4. 成功請戲時送出 GA4 event：request_show，參數 work_id、work_title。
5. API 暫時不可用時，不會卡住整個作品頁；會顯示錯誤訊息。

注意：
這是公開觀眾意向計數，不是防作弊的正式投票。清除瀏覽器資料、無痕模式或不同裝置仍可能再次投票；公開計數 API 也不是高風險資料庫。適合作為節目規劃的熱度參考。

Counter keys:
- qingminglong: 《青瞑的龍蛇無青瞑》
- guishan: 《龜山夫人氣甲衝煙矣！》
- crazy-knight: 《瘋狂騎士闖戲棚》
- xibeiyu: 《西北雨傳奇》
- kutai: 《鮕鮐兄點姻緣》
- yanluo: 《閻羅石磨心》
- jijiyu: 《鯽仔魚娶親》
- chenxiang: 《沉香救母》
- weizheng: 《魏徵斬龍王》
- zhubajie: 《豬八戒痟娶某》
- jinkuixing: 《掠賊賠千金（金魁星）》