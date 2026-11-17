# Windows alternative to fetch-assets.mjs. Usage: powershell -ExecutionPolicy Bypass -File scripts/fetch-assets.ps1
$root = Split-Path -Parent $PSScriptRoot
$m = Get-Content (Join-Path $root 'data/assets.json') -Raw | ConvertFrom-Json
$out = Join-Path $root 'assets/img/atharva'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$ok = 0; $fail = 0
foreach ($a in $m.assets) {
  $url = $m.origin + $a.src
  try { Invoke-WebRequest -Uri $url -OutFile (Join-Path $out $a.file) -UseBasicParsing; Write-Host "ok   $($a.file)"; $ok++ }
  catch { Write-Warning "FAIL $($a.file) $url"; $fail++ }
}
Write-Host "`n$ok downloaded, $fail failed."
