```
# 🚀 Vendor Discovery Platform

An AI-powered platform that automates vendor research, comparison, and shortlist generation. Built for the take-home assignment.

## 🎯 What It Does

This platform solves **Option A: Vendor Discovery + Shortlist Builder**

Enter your needs and requirements, and the platform will:
- 🔍 Search multiple sources for relevant vendors
- 🌐 Visit and scrape official pricing pages and documentation
- 🤖 Analyze vendors using Google Gemini AI
- 📊 Generate a comparison table with evidence-backed insights
- 💾 Save and display your last 5 shortlists
- 📥 Export results to Markdown

## ✨ Features

### Core Features (Required)
- ✅ Vendor need and requirement input (5-8 requirements)
- ✅ Multi-source vendor search (SerpAPI)
- ✅ Automated web scraping (at least 3 vendors per search)
- ✅ AI-powered analysis (Google Gemini API)
- ✅ Comparison table with:
  - Price range
  - Key features matched to requirements
  - Risks and limitations
  - Evidence links with quoted snippets
- ✅ Last 5 shortlists stored and viewable
- ✅ System health check endpoint at `/status`

### Extra Features (Make It Your Own)
- ⚖️ **Weighted Requirements**: Assign priority (1-10) to each requirement
- 🎯 **Smart Scoring**: Overall score and requirement match percentage
- 📤 **Export to Markdown**: Download full report
- 🎨 **Modern UI**: Beautiful gradient design, animations, responsive
- ⚡ **Real-time Progress**: Loading states with step indicators
- 📱 **Mobile Responsive**: Works on all screen sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **AI**: Google Gemini 2.5 Flash (100% FREE, 1,500 req/day)
- **Search**: SerpAPI (FREE tier: 100 searches/month)
- **Web Scraping**: Cheerio
- **UI**: Tailwind CSS, shadcn/ui, Radix UI
- **Hosting**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- Google Gemini API key (100% free, no credit card)
- SerpAPI key (free 100 searches/month)

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd vendor-discovery-platform
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/vendor_discovery"

# Google Gemini AI (100% FREE - Get key: https://aistudio.google.com/app/apikey)
GOOGLE_GEMINI_API_KEY="AIza..."

# SerpAPI (Free 100 searches/month: https://serpapi.com)
SERP_API_KEY="..."

# App Settings
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
MAX_SHORTLISTS_PER_USER=5
SCRAPING_TIMEOUT_MS=10000
```

### 3. Setup Database

**Option A: Docker (Recommended)**
```bash
# Start PostgreSQL in Docker
docker run --name vendor-postgres \
  -e POSTGRES_PASSWORD=vendor_password \
  -e POSTGRES_DB=vendor_discovery \
  -p 5432:5432 \
  -d postgres:15-alpine

# Set DATABASE_URL in .env:
# DATABASE_URL="postgresql://postgres:vendor_password@localhost:5432/vendor_discovery"
```

**Option B: Supabase (Cloud - Free)**
```bash
# 1. Go to: https://supabase.com
# 2. Create project
# 3. Copy "Connection Pooling" string from Settings → Database
# 4. Add to .env as DATABASE_URL
```

**Then push database schema:**
```bash
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the Application

1. Enter a vendor need (e.g., "email marketing platform")
2. Add 5-8 requirements with priorities
3. Click "Build Shortlist"
4. Wait 30-60 seconds for AI analysis
5. View comparison table with evidence
6. Check system health at `/status` or `http://localhost:3000/status`

## 🐳 Docker Deployment (One Command)
```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Start the Next.js app
- Run on http://localhost:3000

## ☁️ Cloud Deployment (Vercel)

### Prerequisites
- Vercel account
- Vercel Postgres or external PostgreSQL

### Steps

1. **Deploy to Vercel**:
```bash
npm install -g vercel
vercel
```

2. **Add Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `GOOGLE_GEMINI_API_KEY` - Your Gemini API key
   - `SERP_API_KEY` - Your SerpAPI key

3. **Setup Database**:
```bash
# After deployment, run migrations
npx prisma db push
```

4. **Access Your App**:
   - Your app will be live at `https://<your-project>.vercel.app`

### Database Options for Hosting

**Option 1: Vercel Postgres** (Recommended for Vercel)
- Free tier: 256MB storage
- Setup: Dashboard → Storage → Create Database → Copy connection string

**Option 2: Supabase** (Free PostgreSQL)
- Free tier: 500MB database, 1GB file storage
- URL: https://supabase.com
- Get connection string from Settings → Database → Connection Pooling

**Option 3: Railway** (Free trial)
- Free $5 credit
- URL: https://railway.app
- One-click PostgreSQL deployment

## 📁 Project Structure
```
vendor-discovery-platform/
├── src/
│   ├── app/                     # Next.js 14 App Router
│   │   ├── api/                 # API routes
│   │   │   ├── health/          # Health check endpoint
│   │   │   └── shortlist/       # Shortlist CRUD
│   │   ├── status/              # Status page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── VendorForm.tsx       # Main input form
│   │   ├── ComparisonTable.tsx  # Results display
│   │   └── ShortlistCard.tsx    # History card
│   ├── lib/
│   │   ├── ai/                  # Gemini AI integration
│   │   │   └── gemini.ts        # AI analysis logic
│   │   ├── db/                  # Database client
│   │   │   └── prisma.ts        # Prisma instance
│   │   ├── scraper/             # Web scraping
│   │   │   └── scraper.ts       # Cheerio scraper
│   │   ├── search/              # SerpAPI integration
│   │   │   └── serpapi.ts       # Search logic
│   │   └── utils.ts             # Helper functions
│   └── types/                   # TypeScript definitions
│       └── index.ts             # Type definitions
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
├── .env.example                 # Environment template
├── docker-compose.yml           # Docker setup
├── Dockerfile                   # Container config
├── package.json
├── AI_NOTES.md                  # AI usage documentation
├── PROMPTS_USED.md              # Prompt examples
├── ABOUTME.md                   # Developer info
└── README.md                    # This file
```

## 🧪 Testing

The app includes:
- ✅ Input validation (empty fields, min requirements)
- ✅ Error handling (API failures, network errors)
- ✅ Health checks (database, AI, search API)
- ✅ Loading states with progress indicators
- ✅ Responsive design testing

### Manual Testing Checklist

1. **Happy Path**:
   - Create shortlist with valid inputs
   - View results table
   - Export to Markdown
   - Check history tab

2. **Error Cases**:
   - Submit without need description
   - Submit without requirements
   - Test with invalid API keys
   - Test with slow network

3. **Health Check**:
   - Visit `/status` endpoint
   - All services showing healthy
   - Response times displayed

## 🔑 Getting Free API Keys

### Google Gemini API (100% FREE Forever)
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Select "Create API key in new project"
5. Copy the key (starts with `AIza...`)
6. Add to `.env` as `GOOGLE_GEMINI_API_KEY`

**Free Tier Limits:**
- ✅ 1,500 requests per day
- ✅ 1 million tokens per month
- ✅ No credit card required
- ✅ No expiration

### SerpAPI (100 Free Searches/Month)
1. Visit https://serpapi.com/users/sign_up
2. Sign up for free account
3. Verify your email
4. Go to dashboard: https://serpapi.com/manage-api-key
5. Copy your API key
6. Add to `.env` as `SERP_API_KEY`

**Free Tier Limits:**
- ✅ 100 searches per month
- ✅ No credit card required
- ✅ Access to Google Search results

## 🏗️ What's Done

### Core Requirements ✅
- [x] Vendor need and requirements input (5-8 requirements)
- [x] Multi-source vendor search (SerpAPI with Google engine)
- [x] Web scraping (3+ vendors per search, up to 6)
- [x] AI analysis with Google Gemini 2.5 Flash
- [x] Comparison table with evidence and snippets
- [x] Last 5 shortlists saved in PostgreSQL
- [x] Health check endpoint at `/status`
- [x] Input validation and error handling
- [x] Clear home page with instructions
- [x] Comprehensive README with setup

### Extra Features ✅
- [x] Weighted requirements (1-10 priority)
- [x] Overall scoring system (0-100)
- [x] Export to Markdown functionality
- [x] Modern, responsive UI with Tailwind CSS
- [x] Real-time progress indicators
- [x] History view with clickable cards
- [x] Docker support for easy deployment

## 🚧 What's Not Done (Known Limitations)

1. **Vendor Exclusion**: Backend supports it, but UI not implemented
2. **Advanced Filtering**: No post-analysis filtering by price/score
3. **User Authentication**: Single-user system, no login
4. **Rate Limiting**: No request throttling implemented
5. **Result Caching**: Each search is fresh (no cache)
6. **Unit Tests**: Manual testing only, no automated tests
7. **Search Customization**: Fixed to top 6-10 results
8. **PDF Support**: Cannot scrape PDF pricing sheets

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
docker ps  # Should show vendor-postgres container

# Or restart database
docker start vendor-postgres

# Reset database schema
npx prisma db push --force-reset
```

### API Key Errors
```bash
# Check .env file has correct keys
cat .env | grep API_KEY

# Verify Gemini API key works
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"

# Verify SerpAPI key works
curl "https://serpapi.com/search?api_key=YOUR_KEY&q=test&num=1&engine=google"
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Slow Performance
- First run is slower (scraping + AI analysis)
- SerpAPI timeout set to 10 seconds
- Gemini API usually responds in 2-5 seconds
- Total processing: 30-60 seconds typical

### SerpAPI Timeout
- Increase timeout in `src/lib/search/serpapi.ts`
- Check your monthly quota (100 searches)
- Verify API key is active

## 📊 Performance Metrics

- **Average Processing Time**: 30-60 seconds
- **Vendors Analyzed**: 5-10 per search
- **API Calls**: 
  - 1 SerpAPI search request
  - 6 web scraping requests
  - 1 Gemini AI analysis
- **Database Queries**: 2-3 per request
- **Cost**: $0 (within free tiers)

## 🔒 Security

- ✅ API keys in environment variables (`.env`)
- ✅ `.env.example` provided (no secrets)
- ✅ `.env` in `.gitignore`
- ✅ Input validation on all forms
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React escaping)
- ✅ No sensitive data in client-side code

## 💰 Cost Breakdown

**Monthly Costs (Free Tier):**
- Google Gemini API: **$0** (1,500 requests/day)
- SerpAPI: **$0** (100 searches/month)
- PostgreSQL (Docker): **$0** (local)
- Hosting (Vercel): **$0** (hobby plan)
- **Total: $0/month**

**If You Exceed Free Tiers:**
- SerpAPI: $50/month for 5,000 searches
- Gemini: Free tier is very generous
- Vercel Postgres: $20/month for 512MB

## 📝 License

MIT License - Free to use for personal and commercial projects

## 👨‍💻 Developer

[Your Name]
- GitHub: [your-github]
- Email: [your-email]
- LinkedIn: [your-linkedin]
- Portfolio: [your-portfolio]

See `ABOUTME.md` for complete resume and background.

## 🙏 Acknowledgments

- Built with Claude AI assistance for development
- Google Gemini API for vendor analysis
- SerpAPI for search functionality
- shadcn/ui for beautiful UI components
- Vercel for hosting platform

## 📚 Additional Documentation

- **`AI_NOTES.md`** - Detailed AI usage, what was automated vs manual
- **`PROMPTS_USED.md`** - All prompts used during development
- **`ABOUTME.md`** - Developer background and resume
- **`DEPLOYMENT.md`** - Deployment guides for various platforms

## 🆘 Need Help?

**Common Issues:**
1. **API keys not working** - Check for spaces/typos in `.env`
2. **Database connection failed** - Ensure PostgreSQL is running
3. **Slow response times** - First request is always slower
4. **Search timeout** - SerpAPI may be slow, increase timeout
5. **Gemini model error** - Verify you're using `gemini-2.5-flash`

**Quick Health Check:**
```bash
# Visit status endpoint
curl http://localhost:3000/api/health

# Should return:
# {
#   "status": "healthy",
#   "services": [
#     {"service": "Database", "status": "healthy"},
#     {"service": "Google Gemini AI", "status": "healthy"},
#     {"service": "SerpAPI Search", "status": "healthy"}
#   ]
# }
```

**For assignment reviewers:** If you encounter any issues, please check:
1. `.env` file is configured with valid API keys
2. Database is running (Docker or cloud)
3. Visit `/status` to verify all services are healthy
4. Check browser console for detailed error messages

---

**Note:** This is a demonstration project built for a take-home assignment. All APIs used have generous free tiers and cost $0 for normal usage. 🚀
```