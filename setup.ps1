# Windows PowerShell Setup Script for Vendor Discovery Platform

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Vendor Discovery Platform - Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "✗ ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Copy .env.example to .env
Write-Host "Creating .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "⚠ WARNING: .env already exists, skipping..." -ForegroundColor Yellow
} else {
    Copy-Item .env.example .env
    Write-Host "✓ Created .env file" -ForegroundColor Green
}
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: npm install failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Generate Prisma Client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERROR: Prisma generate failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green
Write-Host ""

Write-Host "====================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edit .env file and add your API keys:" -ForegroundColor White
Write-Host "   - ANTHROPIC_API_KEY (get from: https://console.anthropic.com)" -ForegroundColor Gray
Write-Host "   - BRAVE_SEARCH_API_KEY (get from: https://brave.com/search/api)" -ForegroundColor Gray
Write-Host "   - DATABASE_URL (see options below)" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Setup database (choose one):" -ForegroundColor White
Write-Host ""
Write-Host "   Option A - Docker (Easiest):" -ForegroundColor Yellow
Write-Host "   docker run --name vendor-postgres -e POSTGRES_PASSWORD=vendor_password -e POSTGRES_DB=vendor_discovery -p 5432:5432 -d postgres:15-alpine" -ForegroundColor Gray
Write-Host "   DATABASE_URL=""postgresql://postgres:vendor_password@localhost:5432/vendor_discovery""" -ForegroundColor Gray
Write-Host ""
Write-Host "   Option B - Supabase (Cloud, Free):" -ForegroundColor Yellow
Write-Host "   Go to https://supabase.com, create project, copy connection string" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Push database schema:" -ForegroundColor White
Write-Host "   npx prisma db push" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Start development:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$openEnv = Read-Host "Do you want to open .env file now? (y/n)"
if ($openEnv -eq "y") {
    notepad .env
}

Write-Host ""
Write-Host "After editing .env, remember to:" -ForegroundColor Yellow
Write-Host "1. Setup your database" -ForegroundColor White
Write-Host "2. Run: npx prisma db push" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
