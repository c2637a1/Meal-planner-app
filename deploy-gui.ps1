Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# 建立表單
$form = New-Object System.Windows.Forms.Form
$form.Text = "🍱 Meal Planner App 部署工具"
$form.Size = New-Object System.Drawing.Size(500, 480)
$form.StartPosition = "CenterScreen"

# 建立 Log 視窗
$logBox = New-Object System.Windows.Forms.TextBox
$logBox.Multiline = $true
$logBox.ScrollBars = "Vertical"
$logBox.ReadOnly = $true
$logBox.Size = New-Object System.Drawing.Size(460, 260)
$logBox.Location = New-Object System.Drawing.Point(10, 160)
$form.Controls.Add($logBox)

function Log($msg) {
    $timestamp = Get-Date -Format "HH:mm:ss"
    $logBox.AppendText("[$timestamp] $msg`r`n")
}

# 建立按鈕們
$buttons = @(
    @{ Text = "啟動 MongoDB";   Action = { Start-MongoDB } },
    @{ Text = "啟動 Backend";   Action = { Start-Backend } },
    @{ Text = "啟動 Frontend";  Action = { Start-Frontend } },
    @{ Text = "匯入 Seed 食譜資料"; Action = { Import-Seed } },
    @{ Text = "一鍵打包 ZIP";   Action = { Build-Zip } }
)

for ($i = 0; $i -lt $buttons.Count; $i++) {
    $btn = New-Object System.Windows.Forms.Button
    $btn.Size = New-Object System.Drawing.Size(220, 40)
    $btn.Location = New-Object System.Drawing.Point(10 + ($i % 2) * 230, 10 + [Math]::Floor($i / 2) * 50)
    $btn.Text = $buttons[$i].Text
    $btn.Add_Click({ $buttons[$i].Action.Invoke() })
    $form.Controls.Add($btn)
}

# MongoDB 啟動
function Start-MongoDB {
    $mongoPath = ".\mongo_portable\bin\mongod.exe"
    if (!(Test-Path $mongoPath)) {
        Log "❌ 找不到 MongoDB 可執行檔：$mongoPath"
        return
    }
    $dataPath = ".\mongodb\data"
    if (!(Test-Path $dataPath)) { New-Item -ItemType Directory -Path $dataPath | Out-Null }

    Start-Process -NoNewWindow -FilePath $mongoPath -ArgumentList "--dbpath `"$dataPath`"" -WindowStyle Hidden
    Log "✅ MongoDB 已啟動。"
}

# 啟動後端
function Start-Backend {
    $backendPath = ".\backend"
    if (!(Test-Path "$backendPath\package.json")) {
        Log "❌ 找不到 backend package.json"
        return
    }
    Start-Process -WorkingDirectory $backendPath -FilePath "npm" -ArgumentList "run start" -NoNewWindow
    Log "✅ Backend 啟動中..."
}

# 啟動前端
function Start-Frontend {
    $frontendPath = ".\frontend"
    if (!(Test-Path "$frontendPath\package.json")) {
        Log "❌ 找不到 frontend package.json"
        return
    }
    Start-Process -WorkingDirectory $frontendPath -FilePath "npm" -ArgumentList "run dev" -NoNewWindow
    Log "✅ Frontend 啟動中..."
}

# 匯入 seed.js
function Import-Seed {
    $seedScript = ".\backend\seed.js"
    if (!(Test-Path $seedScript)) {
        Log "❌ 找不到 seed.js 檔案：$seedScript"
        return
    }
    Start-Process -WorkingDirectory ".\backend" -FilePath "node" -ArgumentList "seed.js" -NoNewWindow
    Log "✅ 已執行 seed.js 匯入初始資料。"
}

# 打包 zip
function Build-Zip {
    $zipName = "MealPlannerDeploy.zip"
    $items = @("backend", "frontend", "mongo_portable", "mongodb", "start-all.bat", "README.md")
    if (Test-Path $zipName) { Remove-Item $zipName }
    Compress-Archive -Path $items -DestinationPath $zipName -Force
    Log "✅ 已建立壓縮檔：$zipName"
}

# 顯示表單
$form.Topmost = $true
$form.Add_Shown({ $form.Activate() })
[void]$form.ShowDialog()
