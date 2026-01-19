# Local Testing Script for AniParadise
# Run this to check if servers are running

Write-Host "`n🧪 AniParadise Local Testing`n" -ForegroundColor Cyan
Write-Host "=" * 50

# Check Backend
Write-Host "`n📡 Backend Server:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 3
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Backend is running on http://localhost:3001" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | Format-List
    }
} catch {
    Write-Host "   ❌ Backend is not running" -ForegroundColor Red
    Write-Host "   💡 Start it with: cd backend; npm run dev" -ForegroundColor Yellow
}

# Check Frontend
Write-Host "`n🎨 Frontend Server:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 3
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend is running on http://localhost:5173" -ForegroundColor Green
    }
} catch {
    Write-Host "   ❌ Frontend is not running" -ForegroundColor Red
    Write-Host "   💡 Start it with: cd frontend; npm run dev" -ForegroundColor Yellow
}

# Test API Endpoint
Write-Host "`n🔍 Testing Anime API:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/anime?q=naruto&limit=1" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Anime API is working!" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        if ($data.data -and $data.data.Count -gt 0) {
            Write-Host "   📺 Found: $($data.data[0].title)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   ❌ Anime API test failed" -ForegroundColor Red
}

Write-Host "`n" + "=" * 50
Write-Host "`n✅ Testing Complete!`n" -ForegroundColor Green
Write-Host "Open http://localhost:5173 in your browser to test the app!`n" -ForegroundColor Cyan
