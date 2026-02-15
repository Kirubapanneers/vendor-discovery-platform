'use client'

import { useState, useEffect } from 'react'
import { VendorForm } from '@/components/VendorForm'
import { ComparisonTable } from '@/components/ComparisonTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, TrendingUp, Sparkles, History } from 'lucide-react'
import { Requirement, ShortlistResult } from '@/types'
import Link from 'next/link'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentShortlist, setCurrentShortlist] = useState<ShortlistResult | null>(null)
  const [history, setHistory] = useState<ShortlistResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/shortlist/history')
      const data = await response.json()
      if (data.success) {
        setHistory(data.shortlists)
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleCreateShortlist = async (need: string, requirements: Requirement[]) => {
    setIsLoading(true)
    setError(null)
    setCurrentShortlist(null)

    try {
      const response = await fetch('/api/shortlist/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ need, requirements }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create shortlist')
      }

      setCurrentShortlist(data.shortlist)
      
      // Refresh history
      await fetchHistory()
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message || 'Failed to create shortlist. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!currentShortlist) return

    const markdown = generateMarkdown(currentShortlist)
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vendor-shortlist-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">VD</span>
            </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Vendor Discovery
                </h1>
                <p className="text-xs text-muted-foreground">AI-Powered Research Platform</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/status">
                <Button variant="outline" size="sm">
                  System Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Find Your Perfect Vendor
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop wasting hours researching. Let AI discover, compare, and analyze vendors for you in minutes.
          </p>
          
          <div className="flex justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5-10</div>
              <div className="text-sm text-muted-foreground">Vendors Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">3-5min</div>
              <div className="text-sm text-muted-foreground">Average Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-muted-foreground">Automated</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="create">
              <TrendingUp className="h-4 w-4 mr-2" />
              Create Shortlist
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History ({history.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <VendorForm onSubmit={handleCreateShortlist} isLoading={isLoading} />

            {/* Loading State */}
            {isLoading && (
              <Card className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 animate-spin text-purple-600" />
                      <span className="font-medium">Processing your request...</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-purple-200 rounded animate-pulse" />
                      <div className="text-sm text-muted-foreground">
                        🔍 Searching for vendors... → 🌐 Scraping websites... → 🤖 Analyzing with AI...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-500">
                <CardContent className="pt-6">
                  <div className="text-red-600">
                    <strong>Error:</strong> {error}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {currentShortlist && (
              <div id="results" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Shortlist Results
                    </CardTitle>
                    <CardDescription>
                      Analyzed {currentShortlist.vendors.length} vendors in{' '}
                      {(currentShortlist.processingTime / 1000).toFixed(1)}s
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Need: {currentShortlist.needDescription}</Badge>
                      <Badge variant="secondary">
                        {currentShortlist.requirements.length} Requirements
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <ComparisonTable 
                  vendors={currentShortlist.vendors} 
                  onExport={handleExport}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No shortlists created yet. Create your first one!
                </CardContent>
              </Card>
            ) : (
              history.map((shortlist) => (
                <Card key={shortlist.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setCurrentShortlist(shortlist)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{shortlist.needDescription}</CardTitle>
                    <CardDescription>
                      {new Date(shortlist.createdAt).toLocaleDateString()} • {shortlist.vendors.length} vendors found
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔍 Automated Research</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Searches multiple sources, scrapes official docs, and extracts pricing & features automatically
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🤖 AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Claude AI analyzes vendors, matches requirements, identifies risks, and provides evidence-based insights
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Smart Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Weighted scoring, requirement matching, and exportable reports help you make informed decisions
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          Vendor Discovery@2026
        </div>
      </footer>
    </div>
  )
}

function generateMarkdown(shortlist: ShortlistResult): string {
  let md = `# Vendor Shortlist: ${shortlist.needDescription}\n\n`
  md += `Generated: ${new Date(shortlist.createdAt).toLocaleString()}\n\n`
  md += `## Requirements\n\n`
  
  shortlist.requirements.forEach((req: Requirement, idx: number) => {
    md += `${idx + 1}. [${req.priority.toUpperCase()}] ${req.description} (Weight: ${req.weight}/10)\n`
  })
  
  md += `\n## Vendor Comparison\n\n`
  
  shortlist.vendors.forEach((vendor, idx) => {
    md += `### ${idx + 1}. ${vendor.name} (Score: ${vendor.overallScore}/100)\n\n`
    md += `**Website:** ${vendor.website}\n\n`
    md += `**Description:** ${vendor.description}\n\n`
    md += `**Pricing:** ${vendor.priceRange} (${vendor.pricingModel})\n\n`
    md += `**Key Features:**\n`
    vendor.keyFeatures.forEach(f => md += `- ${f}\n`)
    md += `\n**Requirements Match:** ${vendor.requirementMatch}%\n\n`
    
    if (vendor.risks.length > 0) {
      md += `**Risks:**\n`
      vendor.risks.forEach(r => md += `- ${r}\n`)
      md += `\n`
    }
    
    md += `---\n\n`
  })
  
  return md
}
