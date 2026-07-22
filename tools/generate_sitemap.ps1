param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^https://[^/]+')]
  [string]$BaseUrl
)

$siteRoot = Split-Path -Parent $PSScriptRoot
$origin = $BaseUrl.TrimEnd('/')
$lastModified = Get-Date -Format 'yyyy-MM-dd'
$paths = @(
  '/',
  '/products/',
  '/products/nickel-alloy-hex-bolts/',
  '/materials/',
  '/materials/inconel-625/',
  '/quote.html'
)

$entries = $paths | ForEach-Object {
  "  <url><loc>$origin$_</loc><lastmod>$lastModified</lastmod></url>"
}

$sitemap = @(
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  $entries,
  '</urlset>',
  ''
) -join [Environment]::NewLine

$robots = @(
  'User-agent: *',
  'Allow: /',
  '',
  "Sitemap: $origin/sitemap.xml",
  ''
) -join [Environment]::NewLine

$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $siteRoot 'sitemap.xml'), $sitemap, $utf8WithoutBom)
[System.IO.File]::WriteAllText((Join-Path $siteRoot 'robots.txt'), $robots, $utf8WithoutBom)

Write-Output "Generated sitemap.xml and robots.txt for $origin"
