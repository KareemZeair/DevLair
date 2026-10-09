<#
Starts DevLair's local development stack:
PostgreSQL (Docker), the Spring Boot API (port 8080), and the Vite UI (port 5173).

Use: .\start-dev.ps1
#>

[CmdletBinding()]
param(
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$repoRoot = $PSScriptRoot
$stateDirectory = Join-Path $repoRoot '.devlair'

function Get-Listener {
    param([int]$Port)

    Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue |
        Select-Object -First 1
}

function Get-ProcessDescription {
    param([int]$TargetProcessId)

    $process = Get-Process -Id $TargetProcessId -ErrorAction SilentlyContinue
    if ($null -eq $process) {
        return "process $TargetProcessId"
    }

    return "$($process.ProcessName) (PID $TargetProcessId)"
}

function Test-HttpEndpoint {
    param([string]$Uri)

    try {
        $response = Invoke-WebRequest -Uri $Uri -TimeoutSec 2 -UseBasicParsing
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    }
    catch {
        return $false
    }
}

function Start-DevLairService {
    param(
        [string]$Name,
        [int]$Port,
        [string]$WorkingDirectory,
        [string]$FilePath,
        [string[]]$ArgumentList,
        [string]$HealthUrl
    )

    $listener = Get-Listener -Port $Port
    if ($null -ne $listener) {
        if (Test-HttpEndpoint -Uri $HealthUrl) {
            Write-Host "$Name is already running on port $Port; reusing it."
            return
        }

        throw "Port $Port is already in use by $(Get-ProcessDescription -TargetProcessId $listener.OwningProcess). It is not responding as DevLair, so the launcher will not stop it."
    }

    $outputLog = Join-Path $stateDirectory "$Name.out.log"
    $errorLog = Join-Path $stateDirectory "$Name.err.log"
    $process = Start-Process -FilePath $FilePath -ArgumentList $ArgumentList -WorkingDirectory $WorkingDirectory -PassThru -RedirectStandardOutput $outputLog -RedirectStandardError $errorLog
    $process.Id | Set-Content -Path (Join-Path $stateDirectory "$Name.pid")
    Write-Host "Started $Name (PID $($process.Id))."
}

function Wait-ForPort {
    param(
        [int]$Port,
        [int]$TimeoutSeconds,
        [string]$ServiceName
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if ($null -ne (Get-Listener -Port $Port)) {
            return
        }
        Start-Sleep -Milliseconds 500
    }

    throw "$ServiceName did not start listening on port $Port within $TimeoutSeconds seconds. Check .devlair\\$ServiceName.err.log."
}

New-Item -ItemType Directory -Force -Path $stateDirectory | Out-Null

if ($null -eq (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker is not installed or is not available on PATH. Install and start Docker Desktop, then run this script again.'
}

Write-Host 'Starting PostgreSQL...'
& docker compose up -d
if ($LASTEXITCODE -ne 0) {
    throw 'Docker Compose could not start PostgreSQL. Confirm Docker Desktop is running, then try again.'
}
Wait-ForPort -Port 5432 -TimeoutSeconds 30 -ServiceName 'PostgreSQL'

Start-DevLairService -Name 'backend' -Port 8080 -WorkingDirectory (Join-Path $repoRoot 'server') -FilePath 'cmd.exe' -ArgumentList @('/c', '.\\gradlew.bat', 'bootRun') -HealthUrl 'http://localhost:8080/api/csrf'
Wait-ForPort -Port 8080 -TimeoutSeconds 90 -ServiceName 'backend'

Start-DevLairService -Name 'frontend' -Port 5173 -WorkingDirectory (Join-Path $repoRoot 'client') -FilePath 'cmd.exe' -ArgumentList @('/c', 'npm.cmd', 'run', 'dev') -HealthUrl 'http://localhost:5173'
Wait-ForPort -Port 5173 -TimeoutSeconds 30 -ServiceName 'frontend'

Write-Host ''
Write-Host 'DevLair is ready at http://localhost:5173'
Write-Host 'Background logs are in .devlair\\backend.out.log and .devlair\\frontend.out.log.'

if (-not $NoBrowser) {
    Start-Process 'http://localhost:5173'
}
