# Deployment Guide

This guide covers deploying the Vendor Discovery Platform to production.

## Option 1: Vercel (Recommended - Easiest)

### Prerequisites
- Vercel account (free tier available)
- GitHub account
- Database (Vercel Postgres or external)

### Step-by-Step

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/vendor-discovery.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect Next.js

3. **Setup Database (Option A: Vercel Postgres)**
- In Vercel dashboard: Storage → Create Database → Postgres
- Copy the connection string
- Will automatically add DATABASE_URL to environment

**Setup Database (Option B: Supabase)**
- Go to https://supabase.com
- Create new project
- Go to Settings → Database
- Copy connection string (use "Connection Pooling" string)

4. **Add Environment Variables**
In Vercel Project Settings → Environment Variables:
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-api03-...
BRAVE_SEARCH_API_KEY=BSA...
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

5. **Deploy**
```bash
npm install -g vercel
vercel --prod
```

Or just push to GitHub, Vercel auto-deploys.

6. **Setup Database Tables**
After first deployment:
```bash
# From Vercel dashboard, run this in the terminal
npx prisma db push
```

Or use Vercel's "Deployments" → Select deployment → "..." → "Redeploy"

7. **Access Your App**
Your app will be live at: `https://your-project-name.vercel.app`

### Troubleshooting Vercel

**Build Fails**
- Check environment variables are set
- Verify DATABASE_URL is correct
- Check build logs for specific errors

**Runtime Errors**
- Check function logs in Vercel dashboard
- Verify API keys are valid
- Check database connection

**Database Issues**
- Run `npx prisma db push` again
- Verify connection string format
- Check Vercel Postgres is in same region

---

## Option 2: Railway (Alternative)

### Prerequisites
- Railway account (free $5 credit)
- GitHub account

### Step-by-Step

1. **Push to GitHub** (same as Vercel)

2. **Deploy to Railway**
- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

3. **Add PostgreSQL**
- In your project, click "+ New"
- Select "Database" → "PostgreSQL"
- Railway will create database and set DATABASE_URL

4. **Add Environment Variables**
- Click your service → Variables
- Add:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
BRAVE_SEARCH_API_KEY=BSA...
NEXT_PUBLIC_APP_URL=${{ RAILWAY_PUBLIC_DOMAIN }}
```

5. **Generate Domain**
- Settings → Generate Domain
- Your app will be at `your-app.up.railway.app`

6. **Setup Database**
Railway auto-runs migrations, but if needed:
```bash
railway run npx prisma db push
```

---

## Option 3: Docker (Any Cloud Provider)

### For AWS, DigitalOcean, Linode, etc.

1. **Build Docker Image**
```bash
docker build -t vendor-discovery .
```

2. **Tag for Registry**
```bash
docker tag vendor-discovery:latest your-registry/vendor-discovery:latest
```

3. **Push to Registry**
```bash
docker push your-registry/vendor-discovery:latest
```

4. **Deploy on Server**
```bash
# Pull image
docker pull your-registry/vendor-discovery:latest

# Run with environment variables
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e ANTHROPIC_API_KEY="sk-ant-api03-..." \
  -e BRAVE_SEARCH_API_KEY="BSA..." \
  -e NEXT_PUBLIC_APP_URL="https://yourdomain.com" \
  your-registry/vendor-discovery:latest
```

5. **Setup Reverse Proxy** (Nginx example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Option 4: Local Docker (Development/Testing)

1. **Create .env file**
```bash
cp .env.example .env
# Edit .env with your API keys
```

2. **Start Everything**
```bash
docker-compose up --build
```

3. **Access App**
Open http://localhost:3000

4. **Stop**
```bash
docker-compose down
```

---

## Database Providers (Free Tiers)

### Vercel Postgres
- **Free Tier**: 256MB storage, 256MB compute
- **Best For**: Vercel deployments
- **Setup**: Vercel Dashboard → Storage → Create

### Supabase
- **Free Tier**: 500MB database, 1GB file storage
- **Best For**: Any deployment
- **Setup**: https://supabase.com → New project
- **Connection**: Use "Connection Pooling" string

### Railway PostgreSQL
- **Free Tier**: $5 credit, ~2GB storage
- **Best For**: Railway deployments
- **Setup**: Auto-created with Railway app

### ElephantSQL
- **Free Tier**: 20MB storage, 5 concurrent connections
- **Best For**: Small projects, testing
- **Setup**: https://elephantsql.com → Create instance

---

## Environment Variables Checklist

Required for production:
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `ANTHROPIC_API_KEY` - Claude API key
- ✅ `BRAVE_SEARCH_API_KEY` - Search API key
- ✅ `NEXT_PUBLIC_APP_URL` - Your app's public URL

Optional:
- `NODE_ENV=production`
- `MAX_SHORTLISTS_PER_USER=5`
- `SCRAPING_TIMEOUT_MS=10000`

---

## Post-Deployment Checklist

After deploying, verify:

1. **App Loads**
   - Visit your URL
   - Home page renders
   - No console errors

2. **Database Connected**
   - Visit `/status`
   - Database shows "healthy"

3. **APIs Working**
   - Visit `/status`
   - Claude AI shows "healthy"
   - Brave Search shows "healthy"

4. **Create Shortlist**
   - Enter a need
   - Add requirements
   - Submit form
   - Wait for results (30-60s)
   - Verify comparison table appears

5. **History Works**
   - Check "History" tab
   - Created shortlist appears
   - Click to view details

6. **Export Works**
   - Click "Export to Markdown"
   - File downloads successfully

---

## Monitoring & Maintenance

### Health Checks
- Visit `/status` regularly
- Monitor API quota usage
- Check database storage

### API Quotas

**Anthropic Claude**
- Free tier: $5 credit
- Monitor at: https://console.anthropic.com
- Each shortlist costs ~$0.02-0.05

**Brave Search**
- Free tier: 2000 requests/month
- Monitor at: https://brave.com/search/api
- Each shortlist uses ~10-15 requests

### Database Maintenance
```bash
# View data
npx prisma studio

# Backup (production)
pg_dump $DATABASE_URL > backup.sql

# Clean old health checks (if needed)
DELETE FROM "HealthCheck" WHERE timestamp < NOW() - INTERVAL '7 days';
```

---

## Scaling Considerations

### When to Upgrade

**Database** (>100 shortlists/day):
- Upgrade to paid tier
- Add read replicas
- Implement caching

**APIs** (>100 requests/day):
- Upgrade to paid tiers
- Implement result caching
- Add rate limiting

**Hosting** (>1000 users/day):
- Upgrade server resources
- Add CDN (Cloudflare)
- Implement load balancing

---

## Troubleshooting Common Issues

### "Cannot connect to database"
- Verify DATABASE_URL is correct
- Check database is running
- Verify firewall allows connections
- Test connection: `psql $DATABASE_URL`

### "Anthropic API error"
- Check API key is valid
- Verify quota not exceeded
- Check API status: https://status.anthropic.com

### "Brave Search error"
- Check API key is valid
- Verify quota not exceeded
- Try alternative search provider

### "Build failed"
- Check Node.js version (need 18+)
- Verify all dependencies installed
- Check TypeScript errors: `npm run build`

### "Page not found"
- Verify build completed
- Check routes in src/app/
- Clear .next cache and rebuild

---

## Security Best Practices

1. **Never commit .env**
   - Use .env.example
   - Add .env to .gitignore

2. **Rotate API keys**
   - Every 90 days
   - After any suspected leak

3. **Use environment variables**
   - Never hardcode secrets
   - Use platform secret management

4. **Enable HTTPS**
   - Use SSL certificates
   - Redirect HTTP → HTTPS

5. **Rate limiting** (future)
   - Add to prevent abuse
   - Use Upstash or similar

---

## Cost Estimates

### Minimal (Free Tier)
- Hosting: $0 (Vercel/Railway free tier)
- Database: $0 (Vercel Postgres/Supabase)
- Claude API: $0 (first $5 credit)
- Brave Search: $0 (2000 req/month)
- **Total: $0/month** for ~50-100 shortlists

### Light Usage (100 shortlists/month)
- Hosting: $0 (Vercel Pro)
- Database: $0-5 (Supabase free)
- Claude API: $2-5
- Brave Search: $0 (within free tier)
- **Total: ~$2-10/month**

### Production (1000 shortlists/month)
- Hosting: $20 (Vercel Pro)
- Database: $15 (Supabase Pro)
- Claude API: $20-50
- Brave Search: $10-20
- **Total: ~$65-105/month**

---

For questions or issues, check:
- GitHub Issues
- Documentation in README.md
- Status page at /status
