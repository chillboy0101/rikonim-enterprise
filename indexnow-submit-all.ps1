$ErrorActionPreference = 'Stop'

$base = 'https://rikonim.com'
$key = 'efe14087cd4844fe921d502c981dec05'
$keyUrl = "$base/$key.txt"

Write-Host "Checking IndexNow key file: $keyUrl"
$keyBody = (Invoke-WebRequest -Uri $keyUrl -UseBasicParsing).Content.Trim()
if ($keyBody -ne $key) {
  throw "Key file content mismatch. Expected '$key' but got '$keyBody'"
}

# Keep consistent with src/app/sitemap.ts
$staticRoutes = @(
  '/',
  '/about',
  '/history',
  '/services',
  '/projects',
  '/media',
  '/blog',
  '/impact-reports',
  '/suppliers',
  '/careers',
  '/leadership',
  '/contact',
  '/privacy-policy',
  '/terms-of-use'
)

$projectsDir = Join-Path (Get-Location) 'content/projects'
$projectSlugs = @()
if (Test-Path $projectsDir) {
  $projectSlugs = Get-ChildItem -Path $projectsDir -Filter '*.md' -File | ForEach-Object { $_.BaseName }
}

$urls = @()
$urls += $staticRoutes | ForEach-Object { "$base$_" }
$urls += $projectSlugs | ForEach-Object { "$base/projects/$($_)" }
$urls = $urls | Sort-Object -Unique

Write-Host ("Total URLs to submit: " + $urls.Count)

function Submit-IndexNowBatch {
  param([string[]]$Batch)

  $payload = @{
    host = 'rikonim.com'
    key = $key
    keyLocation = $keyUrl
    urlList = $Batch
  } | ConvertTo-Json -Depth 4

  $resp = Invoke-WebRequest -Method Post -Uri 'https://api.indexnow.org/IndexNow' -ContentType 'application/json; charset=utf-8' -Body $payload -UseBasicParsing
  return $resp.StatusCode
}

$batchSize = 50
$submitted = 0

for ($i = 0; $i -lt $urls.Count; $i += $batchSize) {
  $end = [Math]::Min($i + $batchSize - 1, $urls.Count - 1)
  $batch = $urls[$i..$end]

  Write-Host ("Submitting batch " + ([int]($i / $batchSize) + 1) + " (" + $batch.Count + " URLs)...")
  $code = Submit-IndexNowBatch -Batch $batch
  Write-Host ("Batch HTTP Status: " + $code)

  if ($code -ne 200) {
    throw ("IndexNow batch failed with HTTP " + $code)
  }

  $submitted += $batch.Count
  Start-Sleep -Seconds 2
}

Write-Host ("Done. Submitted URLs: " + $submitted)
