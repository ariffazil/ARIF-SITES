# Reconfigure Cloudflare Pages Projects to point to arif-fazil-sites repo

$AccountID = "22cc94b77b6d1d2b054be7952710e6"
$ApiToken = "Sz46FSyxqibbrlS8LJQDiNmL2AXlpHsqqNzPH"
$Headers = @{
    "Authorization" = "Bearer $ApiToken"
    "Content-Type" = "application/json"
}

# Projects configuration: ProjectName -> (RootDir, Owner, Repo)
$Projects = @(
    @{ Name = "ariffazil"; RootDir = "body"; Owner = "ariffazil"; Repo = "arif-fazil-sites" }
    @{ Name = "apex"; RootDir = "soul"; Owner = "ariffazil"; Repo = "arif-fazil-sites" }
    @{ Name = "arifos"; RootDir = "docs"; Owner = "ariffazil"; Repo = "arif-fazil-sites" }
)

foreach ($Project in $Projects) {
    $ProjectName = $Project.Name
    $RootDir = $Project.RootDir
    $Owner = $Project.Owner
    $Repo = $Project.Repo
    
    Write-Host "Reconfiguring $ProjectName -> $Repo/$RootDir ..." -ForegroundColor Cyan
    
    $Url = "https://api.cloudflare.com/client/v4/accounts/$AccountID/pages/projects/$ProjectName"
    
    $Body = @{
        source = @{
            type = "github"
            config = @{
                owner = $Owner
                repo_name = $Repo
                production_branch = "main"
                pr_comments_enabled = $true
                deployments_enabled = $true
            }
        }
        build_config = @{
            build_command = "npm install && npm run build"
            destination_dir = "dist"
            root_dir = $RootDir
            web_analytics_token = $null
        }
    } | ConvertTo-Json -Depth 10
    
    try {
        $Response = Invoke-WebRequest -Uri $Url -Method PATCH -Headers $Headers -Body $Body
        $Result = $Response.Content | ConvertFrom-Json
        
        if ($Result.success) {
            Write-Host "✅ $ProjectName reconfigured successfully" -ForegroundColor Green
            Write-Host "   Root: $RootDir | Repo: $Owner/$Repo" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to reconfigure $ProjectName" -ForegroundColor Red
            Write-Host "   Error: $($Result.errors | ConvertTo-Json)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error updating $ProjectName : $_" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "Done! All 3 projects reconfigured." -ForegroundColor Cyan
