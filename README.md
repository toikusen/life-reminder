<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Expiry Butler - 生活到期提醒管家

這是一個用 Angular 建立的應用程序，幫助您管理日常生活中各類物品的到期提醒。

## 功能特色

- **AI 智能識別**: 使用 Google Gemini AI 自動辨識商品資訊
- **分類管理**: 支援 8 種分類（訂閱服務、食品生鮮、證照證件等）
- **到期提醒**: 自定義提前幾天提醒
- **統計分析**: 可視化展示到期情況和花費統計
- **數據導入導出**: 支援 JSON 格式的備份和還原
- **響應式設計**: 完美適配各種設備

## 技術棧

- **框架**: Angular 19
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **圖表**: Recharts
- **圖標**: Lucide Icons
- **AI API**: Google Gemini API

## 本地運行

**前置需求**: Node.js

### 1. 安裝依賴

```bash
npm install
```

### 2. 配置環境變數

複製 `.env.example` 為 `.env`，並設置您的 Gemini API Key：

```bash
cp .env.example .env
```

編輯 `.env` 文件，添加您的 API Key：

```
GEMINI_API_KEY=your-actual-api-key
```

### 3. 運行應用

```bash
npm run dev
```

應用將在 `http://localhost:4200` 啟動。

### 4. 構建生產版本

```bash
npm run build
```

更多詳細信息請查看 [ANGULAR_README.md](./ANGULAR_README.md)
