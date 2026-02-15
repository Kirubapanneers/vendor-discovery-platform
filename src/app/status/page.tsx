'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ServiceStatus {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime?: number
  message?: string
}

interface HealthResponse {
  status: string
  timestamp: string
  services: ServiceStatus[]
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
      setLastChecked(new Date())
    } catch (error) {
      console.error('Failed to check health:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case 'degraded':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
      case 'down':
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <AlertCircle className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500 hover:bg-green-600">Operational</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Degraded</Badge>
      case 'down':
        return <Badge className="bg-red-500 hover:bg-red-600">Down</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">System Status</h1>
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Overall Status */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">
                  {loading ? 'Checking...' : health?.status === 'healthy' ? 'All Systems Operational' : 'Service Issues Detected'}
                </CardTitle>
                <CardDescription>
                  {lastChecked ? `Last checked: ${lastChecked.toLocaleString()}` : 'Checking system health...'}
                </CardDescription>
              </div>
              <Button onClick={checkHealth} disabled={loading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Service Status Cards */}
        {health && (
          <div className="space-y-4">
            {health.services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <CardTitle className="text-xl">{service.service}</CardTitle>
                        <CardDescription>{service.message || 'No message'}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(service.status)}
                      {service.responseTime && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {service.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Service Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Database (PostgreSQL)</h3>
              <p className="text-sm text-muted-foreground">
                Stores shortlists, vendor data, and health check history. Required for all operations.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Google Gemini AI (Google Generative AI)</h3>
              <p className="text-sm text-muted-foreground">
                Powers intelligent vendor analysis, requirement matching, and evidence extraction.
                Free tier: 1,500 requests/day, 1 million tokens/month. 100% free, no credit card required.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">SerpAPI Search</h3>
              <p className="text-sm text-muted-foreground">
                Finds relevant vendor websites and documentation using Google Search results. Free tier: 100 searches/month.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Setup Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Setup Guide</CardTitle>
            <CardDescription>How to get your free API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <strong>1. Google Gemini API (100% FREE Forever):</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">aistudio.google.com/app/apikey</a></li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key" in new project</li>
                <li>Copy the key (starts with AIza...) and add to .env as GOOGLE_GEMINI_API_KEY</li>
                <li>Free: 1,500 requests/day, no credit card needed</li>
              </ul>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <strong>2. SerpAPI (Free 100 searches/month):</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li>Visit <a href="https://serpapi.com/users/sign_up" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">serpapi.com/users/sign_up</a></li>
                <li>Sign up for free account</li>
                <li>Verify your email</li>
                <li>Get your API key from dashboard and add to .env as SERP_API_KEY</li>
                <li>Free: 100 searches/month, no credit card needed</li>
              </ul>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <strong>3. Database (PostgreSQL):</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                <li><strong>Option A (Docker):</strong> docker run --name vendor-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=vendor_discovery -p 5432:5432 -d postgres:15-alpine</li>
                <li><strong>Option B (Cloud):</strong> Use Vercel Postgres (free) or Supabase (free tier)</li>
                <li>Add connection string to .env as DATABASE_URL</li>
                <li>Run: npx prisma db push to setup tables</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cost Information */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">💰 Total Cost: $0/month</CardTitle>
            <CardDescription className="text-green-700">
              All APIs used are 100% free within their generous free tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-green-800">Google Gemini:</strong>
                <p className="text-green-700">$0 (1,500/day free)</p>
              </div>
              <div>
                <strong className="text-green-800">SerpAPI:</strong>
                <p className="text-green-700">$0 (100/month free)</p>
              </div>
              <div>
                <strong className="text-green-800">PostgreSQL:</strong>
                <p className="text-green-700">$0 (local/free tier)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}