# 草台班子咖啡館網站

純 HTML、CSS、JavaScript 的靜態網站，不需安裝套件。

## 在 VS Code 開啟

在 VS Code 開啟整個 `cafe-site` 資料夾，直接預覽 `index.html`。如已安裝 Live Server，可在 `index.html` 按右鍵選擇 **Open with Live Server**。

## 頁面與功能

- `index.html`：首頁輪播與僕人名錄/來店須知導覽卡。
- `menu.html`：菜單頁可依甜點、鹹食分類篩選；今日菜單與菜單小目錄之間有 TextLoop 波浪緞帶；六張本機餐點圖片依檔名顯示，點擊品項可開啟 detail 對話框。
- `staff.html`：僕人名錄以響應式橫向白框拍立得呈現（依參考圖加上斜角與柔和陰影）；滾動滑鼠滾輪、按方向鍵或點箭頭/圓點切換，點擊卡片可看全身立繪。
- `assets/styles.css`：共用版型、`#e4aafb`、`#fb3eb4`、`#fdd6ef`、`#c4fabb` 色系、粉色斜紋主視覺、粗框、貼紙拼貼與手機版樣式。
- `assets/site.js`：輪播、菜單篩選、AnimatedContent 捲動進場、原生 SVG TextLoop 與 BubbleMenu 導覽。
- `assets/fonts/宅在家麥克筆20260121.ttf`：提供的手寫字型。
- `assets/images/`：Figma 標誌/裝飾與 `staff/` 店員立繪。
- 三個頁面使用 CSS 製作的淡紫大格紋背景；左上 MENU 貼紙展開 BubbleMenu 風格的粉色半透明導覽；各頁大標題有輕量進場動畫，支援減少動態效果偏好。
- 三個頁面的頁尾資訊欄皆含《蘭亭集序》節選；電話標籤使用圓角粗框與偏移陰影。
- 頁尾另顯示 IG、FB 圖示與文字標籤，滑過時反轉底色與文字色，不連往外部網站。
- 三個頁面點擊或觸控時會出現粉紫色星芒 ClickSpark 效果；偏好減少動態效果時停用。
- 首次開啟網站時播放一次霓虹 LOGO 開燈開場，可略過；同一分頁工作階段切頁不重播，減少動態效果設定會跳過。
- React Bits 效果依純 HTML/CSS/JavaScript 架構改寫為原生 Canvas/CSS/JavaScript，未加入 React、GSAP 或 vgpu 套件。
- 餐點名稱、價格、照片和營業資訊都是示意資料，後續請依正式素材替換。

## 待提供的參考資料

目前初版依照你提供的 Figma 頁面、風格說明、截圖與字型建置。店員立繪已放入僕人名錄拍立得輪播；人物介紹文字尚待提供。字型、Figma 裝飾與店員圖片由本機檔案載入；餐點照片仍使用網路示意圖。BubbleMenu 與 AnimatedContent 參考效果已用原生前端方式套用，細節可再依預覽調整。
