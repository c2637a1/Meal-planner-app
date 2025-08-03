# 🍱 Meal Planner App

這是一個全端飲食計畫應用程式，包含 React 前端、Node.js 後端以及可攜式 MongoDB。

## 功能

- 食譜管理 (新增、編輯、刪除、查詢)
- 營養成分自動加總與分析
- 過敏原提醒
- 每日飲食均衡建議
- 隨機食譜推薦
- 每日飲食紀錄與報表

## 架構

- **Frontend**: React (Vite)
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB (使用可攜式版本)
- **Deployment**: PowerShell GUI 工具

## 如何開始

### 前置需求

- [Node.js](https://nodejs.org/) (已包含 npm)
- Windows 作業系統 (因使用 PowerShell GUI)

### 安裝

1.  **安裝後端依賴套件**:
    ```bash
    cd backend
    npm install
    cd ..
    ```

2.  **安裝前端依賴套件**:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

### 執行

1.  直接執行根目錄下的 `start-all.bat`。
2.  或者，在根目錄下右鍵點擊 `deploy-gui.ps1` 並選擇 "使用 PowerShell 執行"。

    將會開啟一個圖形化介面，您可以透過按鈕執行以下操作：
    - **啟動 MongoDB**: 啟動可攜式 MongoDB 服務。
    - **啟動 Backend**: 啟動後端 API 伺服器 (http://localhost:5000)。
    - **啟動 Frontend**: 啟動前端 React 應用程式 (通常在 http://localhost:5173)。
    - **匯入 Seed 食譜資料**: 將 `backend/seed.js` 中的預設食譜匯入資料庫。
    - **一鍵打包 ZIP**: 將整個專案打包成 `MealPlannerDeploy.zip`。
