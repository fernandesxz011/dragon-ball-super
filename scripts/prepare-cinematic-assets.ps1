[CmdletBinding()]
param(
    [string] $HeroMasterPath = 'C:\Users\gusta\.codex\generated_images\01a137b1-32ca-7f61-a72d-e20f3638d87d\exec-b2408c69-6cfc-4d44-a412-3849f270fb39.png',
    [string] $HeroConceptPath = 'C:\Users\gusta\.codex\generated_images\01a137b1-32ca-7f61-a72d-e20f3638d87d\exec-6743032d-41e2-4a16-9be9-6126d3c52256.png'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$workspacePrefix = $projectRoot.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar

function Assert-WorkspacePath {
    param([string] $Path)

    $absolutePath = [System.IO.Path]::GetFullPath($Path)
    if (Test-Path -LiteralPath $absolutePath) {
        $absolutePath = (Resolve-Path -LiteralPath $absolutePath).ProviderPath
    }
    if (-not $absolutePath.StartsWith($workspacePrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Path must remain inside the project workspace: $absolutePath"
    }
    return $absolutePath
}

function Get-WorkspacePath {
    param([string] $RelativePath)
    return Assert-WorkspacePath (Join-Path $projectRoot $RelativePath)
}

function Copy-Verified {
    param([string] $Source, [string] $Destination)

    $destinationPath = Assert-WorkspacePath $Destination
    $sourcePath = (Resolve-Path -LiteralPath $Source).ProviderPath
    $sourceHash = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash
    if (-not (Test-Path -LiteralPath $destinationPath)) {
        Copy-Item -LiteralPath $sourcePath -Destination $destinationPath
    }
    $destinationHash = (Get-FileHash -LiteralPath $destinationPath -Algorithm SHA256).Hash
    if ($sourceHash -ne $destinationHash) {
        throw "Copy hash verification failed; both files were preserved: $destinationPath"
    }
}

$masterDirectory = Get-WorkspacePath 'art-source\cinematic'
$conceptDirectory = Get-WorkspacePath 'design\cinematic'
$publicDirectory = Get-WorkspacePath 'public\assets\cinematic'
foreach ($directory in @($masterDirectory, $conceptDirectory, $publicDirectory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    Assert-WorkspacePath $directory | Out-Null
}

# Relocate only the four named public masters, after checking both paths and hashes.
foreach ($name in @('moro', 'granolah', 'super-hero', 'black-freeza')) {
    $publicMaster = Get-WorkspacePath "public\assets\cinematic\$name-cinematic.png"
    $archivedMaster = Get-WorkspacePath "art-source\cinematic\$name-cinematic.png"
    if (Test-Path -LiteralPath $publicMaster) {
        Copy-Verified -Source $publicMaster -Destination $archivedMaster
        Assert-WorkspacePath $publicMaster | Out-Null
        Assert-WorkspacePath $archivedMaster | Out-Null
        Remove-Item -LiteralPath $publicMaster
    } elseif (-not (Test-Path -LiteralPath $archivedMaster)) {
        throw "Missing cinematic master: $name"
    }
}

$heroMaster = Get-WorkspacePath 'art-source\cinematic\hero-cinematic.png'
$heroConcept = Get-WorkspacePath 'design\cinematic\hero-concept.png'
if (-not (Test-Path -LiteralPath $heroMaster)) {
    Copy-Verified -Source $HeroMasterPath -Destination $heroMaster
}
if (-not (Test-Path -LiteralPath $heroConcept)) {
    Copy-Verified -Source $HeroConceptPath -Destination $heroConcept
}

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-CinematicJpeg {
    param([System.Drawing.Image] $Source, [int] $OutputWidth, [string] $Destination)

    if ($OutputWidth -le 0 -or $OutputWidth -gt $Source.Width) {
        throw "Output width must preserve or reduce the source resolution: $Destination"
    }
    $destinationPath = Assert-WorkspacePath $Destination
    $outputHeight = [int][Math]::Round($Source.Height * $OutputWidth / $Source.Width)
    $bitmap = [System.Drawing.Bitmap]::new($OutputWidth, $outputHeight,
        [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    try {
        $graphics.Clear([System.Drawing.Color]::Black)
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $target = [System.Drawing.Rectangle]::new(0, 0, $OutputWidth, $outputHeight)
        $graphics.DrawImage($Source, $target, 0, 0, $Source.Width, $Source.Height,
            [System.Drawing.GraphicsUnit]::Pixel)
        $encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
            [System.Drawing.Imaging.Encoder]::Quality, [long]90)
        $bitmap.Save($destinationPath, $jpegEncoder, $encoderParameters)
    } finally {
        $encoderParameters.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
    }
    return [PSCustomObject]@{
        Name = [System.IO.Path]::GetFileName($destinationPath)
        Width = $OutputWidth
        Height = $outputHeight
        Bytes = (Get-Item -LiteralPath $destinationPath).Length
        SHA256 = (Get-FileHash -LiteralPath $destinationPath -Algorithm SHA256).Hash
    }
}

foreach ($name in @('hero', 'moro', 'granolah', 'super-hero', 'black-freeza')) {
    $source = [System.Drawing.Image]::FromFile((Get-WorkspacePath "art-source\cinematic\$name-cinematic.png"))
    try {
        foreach ($width in @(640, 1120, 1672)) {
            Save-CinematicJpeg -Source $source -OutputWidth $width `
                -Destination (Get-WorkspacePath "public\assets\cinematic\$name-$width.jpg")
        }
    } finally { $source.Dispose() }
}
