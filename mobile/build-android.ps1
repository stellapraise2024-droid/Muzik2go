# Reusable Android build (Windows PowerShell). Cloud build via EAS — no local SDK needed.
# Requires: Node, eas-cli (`npm i -g eas-cli`), `eas login` done once.
# Output: dist-android/muzik2go-preview-0.1.0.apk + SHA-256 printed for verification.
$ErrorActionPreference = "Stop"
$ROOT = Split-Path $PSScriptRoot -Parent
$OUT = Join-Path $ROOT "dist-android\muzik2go-preview-0.1.0.apk"
New-Item -ItemType Directory -Path (Split-Path $OUT -Parent) -Force | Out-Null

Set-Location (Join-Path $ROOT "mobile")
$buildId = (eas build -p android --profile preview --non-interactive --no-wait --json | ConvertFrom-Json).id
Write-Output "Build submitted: $buildId — follow https://expo.dev (takes ~10-20 min)"
Write-Output "When FINISHED, download:"
Write-Output "  eas build:view $buildId --json  # read artifacts.buildUrl"
Write-Output "Then verify:"
Write-Output "  certutil -hashfile `"$OUT`" SHA256"
