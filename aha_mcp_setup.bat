@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Aha! MCP Setup for Claude Desktop
echo ========================================
echo.

REM Check if Claude config exists
set "CONFIG_PATH=%APPDATA%\Claude\claude_desktop_config.json"

if not exist "%APPDATA%\Claude" (
    echo Error: Claude Desktop not found.
    echo Please install Claude Desktop first.
    pause
    exit /b 1
)

REM Get API token from user
echo.
echo Please enter your Aha! API token:
echo (You can find this at: Settings -^> Account -^> Personal -^> Developer -^> API Key)
echo.
set /p "AHA_TOKEN=API Token: "

if "%AHA_TOKEN%"=="" (
    echo Error: API token cannot be empty
    pause
    exit /b 1
)

REM Shared Railway server URL (MASTER CONFIGURATION)
set "RAILWAY_URL=https://ahamcp-production.up.railway.app/sse"

echo.
echo ========================================
echo Configuration:
echo ========================================
echo Server URL: %RAILWAY_URL%
echo API Token: %AHA_TOKEN:~0,8%...
echo Config Path: %CONFIG_PATH%
echo.

REM Backup existing config
if exist "%CONFIG_PATH%" (
    echo Creating backup...
    copy "%CONFIG_PATH%" "%CONFIG_PATH%.backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%" >nul
    echo Backup created
)

REM Create or update config using PowerShell - COMPLETELY REPLACE aha config
echo.
echo Updating Claude Desktop configuration...

powershell -Command "$configPath = '%CONFIG_PATH%'; if (Test-Path $configPath) { $config = Get-Content $configPath -Raw | ConvertFrom-Json } else { $config = [PSCustomObject]@{} }; if (-not $config.mcpServers) { $config | Add-Member -MemberType NoteProperty -Name 'mcpServers' -Value ([PSCustomObject]@{}) -Force }; if ($config.mcpServers.PSObject.Properties.Name -contains 'aha') { Write-Host 'Removing old aha MCP configuration...' -ForegroundColor Yellow; $config.mcpServers.PSObject.Properties.Remove('aha') }; $ahaConfig = [PSCustomObject]@{ url = '%RAILWAY_URL%'; transport = 'sse'; headers = [PSCustomObject]@{ 'X-Aha-Token' = '%AHA_TOKEN%' } }; $config.mcpServers | Add-Member -MemberType NoteProperty -Name 'aha' -Value $ahaConfig -Force; $config | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Configuration updated.
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Completely QUIT Claude Desktop ^(right-click taskbar ^> Close^)
    echo 2. Wait 10 seconds
    echo 3. Reopen Claude Desktop
    echo 4. Look for the tool icon at the bottom
    echo 5. Test: "List all products in Aha!"
    echo.
    echo ========================================
) else (
    echo.
    echo Error: Failed to update configuration
    echo Please contact Ali for help
)

pause