# Fix PATH for current PowerShell session
# This adds Node.js and npm to your current session's PATH

$nodePath = "C:\Program Files\nodejs"
if (Test-Path $nodePath) {
    if ($env:Path -notlike "*$nodePath*") {
        $env:Path = "$nodePath;$env:Path"
        Write-Host "✅ Added Node.js to PATH" -ForegroundColor Green
    } else {
        Write-Host "✅ Node.js already in PATH" -ForegroundColor Green
    }
    
    # Verify it works
    Write-Host "`nVerifying installations..." -ForegroundColor Cyan
    Write-Host "Node.js: " -NoNewline
    node --version
    Write-Host "npm: " -NoNewline
    npm --version
    Write-Host "`n✅ Everything is ready! You can now use npm commands." -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found at $nodePath" -ForegroundColor Red
    Write-Host "Please reinstall Node.js" -ForegroundColor Yellow
}
