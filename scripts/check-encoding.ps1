param(
    [string]$Path = "index.html"
)

if (-not (Test-Path -LiteralPath $Path)) {
    Write-Error "File not found: $Path"
    exit 1
}

$content = Get-Content -LiteralPath $Path -Raw -Encoding UTF8

# Common mojibake markers and suspicious placeholders in Polish text.
$patterns = @(
    'Ä', 'Ă', 'Ĺ', 'Ã', 'â€“', 'â€”', 'â€', '�',
    'projekt\?w', 'u\?ytkownika', 'do\?wiadczenia', 'k\?tem', 'zwi\?zane'
)

$issues = @()
foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
        $issues += $pattern
    }
}

if ($issues.Count -gt 0) {
    Write-Host "Encoding check FAILED for $Path" -ForegroundColor Red
    Write-Host "Detected suspicious patterns:" -ForegroundColor Yellow
    $issues | Sort-Object -Unique | ForEach-Object { Write-Host " - $_" }
    exit 1
}

Write-Host "Encoding check OK for $Path" -ForegroundColor Green
exit 0
