# List all Cloudflare Pages projects

$AccountID = "22cc94b77b6d1d2b054be7952710e6"
$ApiToken = "Sz46FSyxqibbrlS8LJQDiNmL2AXlpHsqqNzPH"
$Headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

Write-Host "Fetching Cloudflare Pages projects..." -ForegroundColor Cyan

$Url = "https://api.cloudflare.com/client/v4/accounts/$AccountID/pages/projects"

try {
    $Response = Invoke-WebRequest -Uri $Url -Method GET -Headers $Headers
    $Result = $Response.Content | ConvertFrom-Json
    
    if ($Result.success) {
        Write-Host "✅ Found $($Result.result.Count) projects:" -ForegroundColor Green
        foreach ($Project in $Result.result) {
            Write-Host "  - Name: $($Project.name)" -ForegroundColor Yellow
            Write-Host "    URL: $($Project.domains[0])" -ForegroundColor Gray
            Write-Host "    Source: $($Project.source.type)" -ForegroundColor Gray
            if ($Project.source.config) {
                Write-Host "    Repo: $($Project.source.config.owner)/$($Project.source.config.repo_name)" -ForegroundColor Gray
            }
            Write-Host ""
        }
    } else {
        Write-Host "❌ API Error: $($Result.errors | ConvertTo-Json)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}
