$src_dir = "c:\Projects\careeros\src"
$files_to_update = Get-ChildItem -Path $src_dir -Recurse -Include *.tsx,*.ts,*.jsx,*.js,*.css | Where-Object { -not $_.PSIsContainer }

$replacements = @{
    "#0F172A" = "#14231E"
    "#2563EB" = "#1F5E4D"
    "#38BDF8" = "#B8872F"
    "#F97316" = "#B8872F"
    "#090D16" = "#14231E"
    "#111827" = "#FFFFFF"
    "#1E293B" = "#DDE4DE"
    "#F59E0B" = "#B8872F"
    "#F8FAFC" = "#F7F8F5"
    "shadow-md" = "shadow-sm"
    "shadow-lg" = "shadow-sm"
    "shadow-xl" = "shadow-sm"
    "shadow-2xl" = "shadow-sm"
    "shadow-inner" = "shadow-sm"
}

foreach ($file in $files_to_update) {
    $path = $file.FullName
    $content = Get-Content $path -Raw
    
    $needsUpdate = $false
    foreach ($key in $replacements.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $needsUpdate = $true
            break
        }
    }
    
    if ($needsUpdate) {
        foreach ($key in $replacements.Keys) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
        }
        Set-Content -Path $path -Value $content -Encoding UTF8
        Write-Host "Updated: $($file.Name)"
    }
}
