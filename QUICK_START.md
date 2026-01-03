# 🚀 快速開始指南

## 一、安裝與設置

### 1. 安裝依賴
```bash
npm install
```

### 2. 配置 Gemini API
```bash
# 複製環境變數模板
cp .env.example .env

# 編輯 .env 文件，添加你的 API Key
# GEMINI_API_KEY=your-actual-key-here
```

### 3. 啟動開發服務器
```bash
npm run dev
```

應用將自動打開於 `http://localhost:4200`

## 二、Angular 版本的主要特性

### ✅ 已轉換的功能

| 功能 | 說明 |
|------|------|
| 📊 **儀表板** | 展示 7 天內到期和已過期項目統計 |
| 📋 **列表視圖** | 可按分類篩選的項目列表 |
| 📈 **統計分析** | 每月支出和分類佔比分析 |
| ⚙️ **設定** | 提醒時間、幣別設置和數據管理 |
| 🤖 **AI 識別** | 拍照自動識別項目信息（需要 API Key） |
| 💾 **數據持久化** | 本地 localStorage 存儲 |

## 三、項目架構

```
src/
├── app/
│   ├── app.component.ts              # 主應用組件
│   ├── types.ts                      # 類型定義
│   ├── constants.ts                  # 常數
│   ├── components/
│   │   ├── dashboard.component.ts    # 儀表板
│   │   ├── add-edit-modal.component.ts
│   │   ├── expiry-item-card.component.ts
│   │   ├── summary.component.ts      # 統計
│   │   └── settings.component.ts     # 設定
│   └── services/
│       ├── data.service.ts           # 數據服務
│       └── gemini.service.ts         # AI 服務
├── main.ts                           # 應用入口
├── styles.css                        # 全局樣式
└── index.html
```

## 四、開發命令

```bash
# 開發模式（自動打開瀏覽器）
npm run dev

# 生產構建
npm run build

# 預覽生產版本
npm run preview

# 使用 Angular CLI 命令
npm run ng -- generate component my-component
```

## 五、關鍵技術

- **Framework**: Angular 19
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3
- **Icons**: Unicode/Emoji（無外部依賴）
- **AI**: Google Gemini API
- **State Management**: RxJS Services
- **Build Tool**: Angular CLI + Webpack

## 六、更改 React 到 Angular 的概念映射

| React | Angular |
|-------|---------|
| useState | Service + Component Property |
| useEffect | ngOnInit, ngOnChanges |
| onClick | (click)="handler()" |
| {condition && <Component />} | *ngIf="condition" |
| {list.map()} | *ngFor="let item of list" |
| Props | @Input() |
| Event Handler | @Output() EventEmitter |

## 七、功能演示

### 新增項目
1. 點擊右上角 `+` 按鈕
2. 選擇類別
3. 輸入項目名稱和到期日期
4. 點擊「確定新增」

### 編輯項目
1. 在列表中找到項目
2. 點擊鉛筆圖標
3. 修改信息
4. 點擊「儲存變更」

### AI 識別
1. 新增項目時點擊「AI 拍照自動輸入」
2. 用相機拍攝商品標籤或單據
3. AI 自動填入項目信息

### 數據管理
1. 進入設定頁面
2. 點擊「備份匯出」下載 JSON
3. 點擊「還原匯入」上傳 JSON

## 八、排除故障

### 應用無法啟動？
```bash
# 清除 node_modules 並重新安裝
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### AI 識別不工作？
- 檢查 `.env` 文件中的 API Key 是否正確
- 確保網絡連接正常
- 檢查 API Key 配額

### 樣式不顯示？
- 清除瀏覽器緩存
- 硬刷新（Ctrl+Shift+R 或 Cmd+Shift+R）

## 九、性能優化

Angular 版本包含以下優化：

✅ 獨立組件（Standalone Components）
✅ 樹搖晃（Tree Shaking）
✅ AOT 編譯
✅ 代碼分割
✅ 懶加載支持

## 十、下一步建議

1. **測試**: 添加單元測試和 E2E 測試
2. **路由**: 使用 Angular Router 改進導航
3. **PWA**: 添加 Service Worker 支持
4. **部署**: 部署到 Firebase、Vercel 或 Netlify
5. **功能**: 添加更多分析和提醒功能

## 十一、常見問題

**Q: 如何更改應用名稱？**
A: 編輯 `index.html` 的 `<title>` 標籤和 `app.component.ts` 中的應用名稱

**Q: 支持多語言嗎？**
A: 目前為繁體中文，可使用 Angular i18n 添加多語言支持

**Q: 如何添加新頁面？**
A: 使用 Angular CLI 生成新組件：`ng generate component new-page`

## 支持與反饋

有問題或建議？請查看 [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md) 了解更多技術細節。
