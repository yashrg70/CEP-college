# Raksha Connect - 1-Click Launch Script for Windows PowerShell
param([int]$Port = 5000)

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  🛡️ RAKSHA CONNECT — Smart Citizen Support System" -ForegroundColor Cyan
Write-Host "  One app. The right helpline. Instantly." -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green

$pythonCmd = Get-Command python -ErrorAction SilentlyContinue

if ($pythonCmd) {
    Write-Host "Starting Flask Full-Stack Server on port $Port..." -ForegroundColor Yellow
    $env:PORT = $Port
    Start-Process "http://localhost:$Port/"
    python app.py
} else {
    Write-Host "Python not found in current PATH. Starting native HTTP server on port $Port..." -ForegroundColor Yellow
    $url = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($url)
    $listener.Start()
    Write-Host "Running at $url" -ForegroundColor Green
    Start-Process $url

    $mimeMap = @{
        ".html" = "text/html; charset=utf-8"
        ".css"  = "text/css; charset=utf-8"
        ".js"   = "application/javascript; charset=utf-8"
        ".json" = "application/json"
        ".png"  = "image/png"
        ".svg"  = "image/svg+xml"
        ".ico"  = "image/x-icon"
    }

    try {
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $relPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($relPath)) { $relPath = "index.html" }

            $localFile = Join-Path $PSScriptRoot $relPath
            if (Test-Path $localFile -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
                $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($localFile)
                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($notFound, 0, $notFound.Length)
            }
            $response.Close()
        }
    }
    finally {
        $listener.Stop()
        $listener.Close()
    }
}
