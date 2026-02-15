@echo off
REM Windows Setup Script for Vendor Discovery Platform

echo ====================================
echo Vendor Discovery Platform - Setup
echo ====================================
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found: 
node --version
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Copy .env.example to .env
echo Creating .env file...
if exist ".env" (
    echo WARNING: .env already exists, skipping...
) else (
    copy .env.example .env
    echo ✓ Created .env file
)
echo.

REM Install dependencies
echo Installing dependencies (this may take a few minutes)...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Generate Prisma Client
echo Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo NEXT STEPS:
echo.
echo 1. Edit .env file and add your API keys:
echo    - ANTHROPIC_API_KEY (get from: https://console.anthropic.com)
echo    - BRAVE_SEARCH_API_KEY (get from: https://brave.com/search/api)
echo    - DATABASE_URL (see options below)
echo.
echo 2. Setup database (choose one):
echo.
echo    Option A - Docker (Easiest):
echo    docker run --name vendor-postgres -e POSTGRES_PASSWORD=vendor_password -e POSTGRES_DB=vendor_discovery -p 5432:5432 -d postgres:15-alpine
echo    DATABASE_URL="postgresql://postgres:vendor_password@localhost:5432/vendor_discovery"
echo.
echo    Option B - Supabase (Cloud, Free):
echo    Go to https://supabase.com, create project, copy connection string
echo.
echo 3. Push database schema:
echo    npx prisma db push
echo.
echo 4. Start development:
echo    npm run dev
echo.
echo 5. Open browser:
echo    http://localhost:3000
echo.
echo ====================================
echo.
echo Press any key to open .env file for editing...
pause >nul

notepad .env

echo.
echo After editing .env, remember to:
echo 1. Setup your database
echo 2. Run: npx prisma db push
echo 3. Run: npm run dev
echo.
pause
