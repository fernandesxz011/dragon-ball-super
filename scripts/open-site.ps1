param([switch] $NoBrowser)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$siteUrl = 'http://127.0.0.1:5173/'

function Test-SiteReady {
    try {
        $response = Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200 -and $response.Content.Contains('Dragon Ball Super')
    } catch {
        return $false
    }
}

if (-not (Test-SiteReady)) {
    $listener = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
    if ($listener) {
        throw 'A porta 5173 esta ocupada por outro servidor. Encerre esse servidor antes de abrir o site.'
    }

    $vitePath = Join-Path $projectRoot 'node_modules\vite\bin\vite.js'
    if (-not (Test-Path -LiteralPath $vitePath -PathType Leaf)) {
        throw 'Dependencias ausentes. Execute npm.cmd ci na pasta do projeto e tente novamente.'
    }

    $nodePath = (Get-Command node.exe -ErrorAction Stop).Source
    $logDirectory = Join-Path $projectRoot '.cache\runtime'
    New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

    $serverProcess = Start-Process -FilePath $nodePath `
        -ArgumentList 'node_modules/vite/bin/vite.js' `
        -WorkingDirectory $projectRoot `
        -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $logDirectory 'vite.stdout.log') `
        -RedirectStandardError (Join-Path $logDirectory 'vite.stderr.log') `
        -PassThru

    $deadline = [DateTime]::UtcNow.AddSeconds(20)
    $ready = $false
    do {
        $ready = Test-SiteReady
        if (-not $ready) { Start-Sleep -Milliseconds 250 }
    } while (-not $ready -and [DateTime]::UtcNow -lt $deadline -and -not $serverProcess.HasExited)

    if (-not $ready) {
        throw "Nao foi possivel iniciar o site. Consulte os logs em $logDirectory."
    }

    Set-Content -LiteralPath (Join-Path $logDirectory 'vite.pid') -Value $serverProcess.Id -Encoding ASCII
}

if (-not $NoBrowser) {
    Start-Process -FilePath $siteUrl
}

Write-Output "Site disponivel: $siteUrl"
