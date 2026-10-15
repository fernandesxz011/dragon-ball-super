Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$referenceDirectory = Join-Path $projectRoot 'Dragon_Ball_Super_Codex\referencias'
$assetDirectory = Join-Path $projectRoot 'public\assets'
$derivedDirectory = Join-Path $assetDirectory 'derived'
New-Item -ItemType Directory -Path $derivedDirectory -Force | Out-Null

$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-JpegAsset {
    param(
        [System.Drawing.Image] $Source,
        [System.Drawing.Rectangle] $Crop,
        [string] $Destination,
        [int] $OutputWidth
    )

    if ($Crop.Width -le 0 -or $Crop.Height -le 0 -or $Crop.Left -lt 0 -or $Crop.Top -lt 0 -or
        $Crop.Right -gt $Source.Width -or $Crop.Bottom -gt $Source.Height) {
        throw "Crop outside the source image bounds: $Destination"
    }
    if ($OutputWidth -le 0 -or $OutputWidth -gt $Crop.Width) {
        throw "Output width must preserve or reduce the crop resolution: $Destination"
    }

    $outputHeight = [int][Math]::Round($Crop.Height * $OutputWidth / $Crop.Width)
    $bitmap = [System.Drawing.Bitmap]::new($OutputWidth, $outputHeight,
        [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
    try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $destinationRectangle = [System.Drawing.Rectangle]::new(0, 0, $OutputWidth, $outputHeight)
        $graphics.DrawImage($Source, $destinationRectangle, $Crop, [System.Drawing.GraphicsUnit]::Pixel)
        $encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
            [System.Drawing.Imaging.Encoder]::Quality, [long]92)
        $bitmap.Save($Destination, $jpegEncoder, $encoderParameters)
    } finally {
        $encoderParameters.Dispose()
        $graphics.Dispose()
        $bitmap.Dispose()
    }
}

$hero = [System.Drawing.Image]::FromFile((Join-Path $referenceDirectory '02_Poster_Cinematografico.png'))
try {
    $fullImage = [System.Drawing.Rectangle]::new(0, 0, $hero.Width, $hero.Height)
    foreach ($width in @(640, 1120, 1672)) {
        Save-JpegAsset -Source $hero -Crop $fullImage -OutputWidth $width `
            -Destination (Join-Path $assetDirectory "hero-$width.jpg")
    }
} finally { $hero.Dispose() }

# These boundaries were reviewed on the original, not estimated as equal fifths.
$bands = @(
    @{ Name = 'moro'; Y = 172; Height = 161; FocusX = 120; FocusWidth = 1300; MobileX = 160; MobileWidth = 720 },
    @{ Name = 'granolah'; Y = 337; Height = 150; FocusX = 0; FocusWidth = 1400; MobileX = 80; MobileWidth = 640 },
    @{ Name = 'super-hero'; Y = 492; Height = 137; FocusX = 0; FocusWidth = 1450; MobileX = 100; MobileWidth = 640 },
    @{ Name = 'black-freeza'; Y = 632; Height = 161; FocusX = 100; FocusWidth = 1650; MobileX = 220; MobileWidth = 720 }
)

$panorama = [System.Drawing.Image]::FromFile((Join-Path $referenceDirectory '05_Panorama_Continuacao.png'))
try {
    foreach ($band in $bands) {
        $desktopCrop = [System.Drawing.Rectangle]::new(0, $band.Y, $panorama.Width, $band.Height)
        Save-JpegAsset -Source $panorama -Crop $desktopCrop -OutputWidth $panorama.Width `
            -Destination (Join-Path $derivedDirectory "$($band.Name).jpg")
        $focusCrop = [System.Drawing.Rectangle]::new($band.FocusX, $band.Y, $band.FocusWidth, $band.Height)
        Save-JpegAsset -Source $panorama -Crop $focusCrop -OutputWidth $band.FocusWidth `
            -Destination (Join-Path $derivedDirectory "$($band.Name)-focus.jpg")
        $mobileCrop = [System.Drawing.Rectangle]::new($band.MobileX, $band.Y, $band.MobileWidth, $band.Height)
        Save-JpegAsset -Source $panorama -Crop $mobileCrop -OutputWidth $band.MobileWidth `
            -Destination (Join-Path $derivedDirectory "$($band.Name)-mobile.jpg")
    }
} finally { $panorama.Dispose() }

Write-Output 'Assets derivados gerados. As cinco imagens originais foram preservadas.'
