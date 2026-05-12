$port = 8000
$folder = Get-Location

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server running at http://localhost:$port"
Write-Host "Serving files from: $folder"
Write-Host "Press Ctrl+C to stop"

while ($true) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $url = $request.Url.LocalPath
    if ($url -eq "/") { $url = "/index.html" }
    
    $filePath = Join-Path $folder $url.TrimStart("/")
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $content.Length
        
        # Set content type based on file extension
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        switch ($ext) {
            ".html" { $response.ContentType = "text/html" }
            ".css" { $response.ContentType = "text/css" }
            ".js" { $response.ContentType = "text/javascript" }
            ".json" { $response.ContentType = "application/json" }
            ".png" { $response.ContentType = "image/png" }
            ".jpg" { $response.ContentType = "image/jpeg" }
            ".gif" { $response.ContentType = "image/gif" }
            ".md" { $response.ContentType = "text/markdown" }
            default { $response.ContentType = "application/octet-stream" }
        }
        
        $response.OutputStream.Write($content, 0, $content.Length)
        $response.StatusCode = 200
        Write-Host "GET $url - 200"
    } else {
        $response.StatusCode = 404
        Write-Host "GET $url - 404"
    }
    
    $response.OutputStream.Close()
}
