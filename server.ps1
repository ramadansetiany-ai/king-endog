# ====================================================================
# KING ENDOG - Multi-Device Local HTTP Server (PC & Smartphone / HP)
# Berjalan di port 3000 menggunakan TcpListener (Support Localhost & IP Wi-Fi)
# ====================================================================

param(
    [int]$Port = 3000
)

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $currentDir

# Dapatkan IP Wi-Fi / LAN Lokal untuk akses dari HP
$localIP = "127.0.0.1"
try {
    $ipObj = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
        $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.254\.' 
    } | Select-Object -First 1
    if ($ipObj) {
        $localIP = $ipObj.IPAddress
    }
} catch {
    $localIP = "127.0.0.1"
}

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)

try {
    $listener.Start()
} catch {
    Write-Host "[X] Port $Port sedang digunakan. Menutup proses lama..." -ForegroundColor Red
    $Port = 3005
    $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "  👑🥚 KING ENDOG - Server Mobile Web App Berjalan!        " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Yellow
Write-Host "💻 Akses dari Laptop / PC : http://localhost:$Port" -ForegroundColor Cyan
Write-Host "📱 Akses dari HP [Wi-Fi]    : http://$($localIP):$Port" -ForegroundColor Magenta
Write-Host "📁 Direktori Aplikasi      : $currentDir" -ForegroundColor White
Write-Host "Tekan CTRL + C untuk mematikan server.`n" -ForegroundColor Gray

# Buka otomatis di browser PC
Start-Process "http://localhost:$Port"

$mimeTypes = @{
    ".html"        = "text/html; charset=utf-8"
    ".htm"         = "text/html; charset=utf-8"
    ".css"         = "text/css; charset=utf-8"
    ".js"          = "application/javascript; charset=utf-8"
    ".json"        = "application/json; charset=utf-8"
    ".webmanifest" = "application/manifest+json; charset=utf-8"
    ".png"         = "image/png"
    ".jpg"         = "image/jpeg"
    ".jpeg"        = "image/jpeg"
    ".svg"         = "image/svg+xml"
    ".ico"         = "image/x-icon"
}

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        
        $buffer = New-Object byte[] 4096
        $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
        if ($bytesRead -le 0) {
            $client.Close()
            continue
        }
        
        $requestText = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $bytesRead)
        $firstLine = $requestText.Split("`n")[0].Trim()
        $tokens = $firstLine.Split(" ")
        
        if ($tokens.Length -lt 2) {
            $client.Close()
            continue
        }
        
        $method = $tokens[0]
        $rawPath = $tokens[1]
        
        # Pisahkan query string
        $pathWithoutQuery = $rawPath.Split("?")[0].TrimStart('/')
        if ([string]::IsNullOrEmpty($pathWithoutQuery) -or $pathWithoutQuery -eq "/") {
            $pathWithoutQuery = "index.html"
        }
        
        $decodedPath = [System.Uri]::UnescapeDataString($pathWithoutQuery).Replace('/', '\')
        $filePath = [System.IO.Path]::Combine($currentDir, $decodedPath)
        
        if ($method -eq "OPTIONS") {
            $corsHeaders = "HTTP/1.1 200 OK`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nAccess-Control-Allow-Headers: *`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
            $hBytes = [System.Text.Encoding]::UTF8.GetBytes($corsHeaders)
            $stream.Write($hBytes, 0, $hBytes.Length)
            $stream.Close()
            $client.Close()
            continue
        }

        # API Sinkronisasi Data Wi-Fi Lokal
        if ($pathWithoutQuery -eq "api/data" -or $pathWithoutQuery -eq "api\data") {
            $dataDir = [System.IO.Path]::Combine($currentDir, "data")
            if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir -Force | Out-Null }
            $dataFile = [System.IO.Path]::Combine($dataDir, "farm_data.json")

            if ($method -eq "GET") {
                $content = if (Test-Path $dataFile) { [System.IO.File]::ReadAllText($dataFile, [System.Text.Encoding]::UTF8) } else { "{}" }
                $cBytes = [System.Text.Encoding]::UTF8.GetBytes($content)
                $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nAccess-Control-Allow-Origin: *`r`nContent-Length: $($cBytes.Length)`r`nConnection: close`r`n`r`n"
                $hBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($hBytes, 0, $hBytes.Length)
                $stream.Write($cBytes, 0, $cBytes.Length)
            } elseif ($method -eq "POST") {
                $bodyIndex = $requestText.IndexOf("`r`n`r`n")
                $body = ""
                if ($bodyIndex -ge 0) {
                    $body = $requestText.Substring($bodyIndex + 4)
                }
                if (-not [string]::IsNullOrWhiteSpace($body)) {
                    [System.IO.File]::WriteAllText($dataFile, $body, [System.Text.Encoding]::UTF8)
                }
                $resp = '{"success":true,"timestamp":' + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() + '}'
                $rBytes = [System.Text.Encoding]::UTF8.GetBytes($resp)
                $header = "HTTP/1.1 200 OK`r`nContent-Type: application/json; charset=utf-8`r`nAccess-Control-Allow-Origin: *`r`nContent-Length: $($rBytes.Length)`r`nConnection: close`r`n`r`n"
                $hBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($hBytes, 0, $hBytes.Length)
                $stream.Write($rBytes, 0, $rBytes.Length)
            }
            $stream.Flush()
            $stream.Close()
            $client.Close()
            continue
        }
        
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $header = "HTTP/1.1 200 OK`r`n" +
                      "Content-Type: $contentType`r`n" +
                      "Content-Length: $($fileBytes.Length)`r`n" +
                      "Access-Control-Allow-Origin: *`r`n" +
                      "Connection: close`r`n`r`n"
                      
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($fileBytes, 0, $fileBytes.Length)
        } else {
            $notFound = "<h1>404 Not Found</h1><p>File $pathWithoutQuery tidak ditemukan di server King Endog.</p>"
            $nfBytes = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $header = "HTTP/1.1 404 Not Found`r`n" +
                      "Content-Type: text/html; charset=utf-8`r`n" +
                      "Content-Length: $($nfBytes.Length)`r`n" +
                      "Access-Control-Allow-Origin: *`r`n" +
                      "Connection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($nfBytes, 0, $nfBytes.Length)
        }
        
        $stream.Flush()
        $stream.Close()
        $client.Close()
    } catch {
        # Abaikan error client disconnect
    }
}
