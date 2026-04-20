# Port Entity Push Script
# Pushes all Walmart mock service entities to Port.io

param(
    [string]$ClientId = $env:PORT_CLIENT_ID,
    [string]$ClientSecret = $env:PORT_CLIENT_SECRET
)

Write-Host "=== Port.io Entity Push Script ===" -ForegroundColor Cyan

# Get access token
$tokenBody = @{ clientId = $ClientId; clientSecret = $ClientSecret } | ConvertTo-Json
$tokenResponse = Invoke-RestMethod -Uri "https://api.getport.io/v1/auth/access_token" -Method POST -ContentType "application/json" -Body $tokenBody
$token = $tokenResponse.accessToken
Write-Host "✓ Authenticated with Port.io" -ForegroundColor Green

$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }

# Load entities
$entities = Get-Content "$PSScriptRoot/entities/services.json" | ConvertFrom-Json

foreach ($entity in $entities) {
    $blueprint = $entity.blueprint
    $identifier = $entity.identifier
    
    $body = @{
        identifier = $entity.identifier
        title = $entity.title
        properties = $entity.properties
        relations = $entity.relations
    } | ConvertTo-Json -Depth 10

    try {
        $response = Invoke-RestMethod `
            -Uri "https://api.getport.io/v1/blueprints/$blueprint/entities?upsert=true&merge=true" `
            -Method POST `
            -Headers $headers `
            -Body $body
        Write-Host "✓ Upserted entity: $identifier ($blueprint)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to upsert $identifier : $_" -ForegroundColor Red
    }
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
