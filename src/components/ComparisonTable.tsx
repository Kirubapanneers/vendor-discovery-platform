'use client'

import { VendorComparison } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, CheckCircle2, XCircle, AlertTriangle, Download } from 'lucide-react'

interface ComparisonTableProps {
  vendors: VendorComparison[]
  onExport?: () => void
}

export function ComparisonTable({ vendors, onExport }: ComparisonTableProps) {
  if (vendors.length === 0) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vendor Comparison</h2>
        {onExport && (
          <Button onClick={onExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export to Markdown
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {vendors.map((vendor, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{vendor.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Rank #{index + 1}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {vendor.description}
                  </p>
                  <a 
                    href={vendor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    {vendor.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getScoreColor(vendor.overallScore)}`}>
                    {vendor.overallScore}
                  </div>
                  <div className="text-xs text-muted-foreground">Overall Score</div>
                  <div className="text-sm font-medium mt-1">
                    {vendor.requirementMatch}% Match
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Pricing */}
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">💰 Pricing</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-lg font-bold text-primary">{vendor.priceRange}</span>
                  <Badge variant="outline">{vendor.pricingModel}</Badge>
                  <span className="text-sm text-muted-foreground">{vendor.currency}</span>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">✨ Key Features</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.keyFeatures.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Matched Requirements */}
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                  ✅ Requirements Analysis
                </h3>
                <div className="space-y-2">
                  {vendor.matchedRequirements.map((match, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-sm p-2 bg-muted/50 rounded">
                      {match.met ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{match.requirement}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {match.evidence}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Limitations */}
              {vendor.risks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Risks & Limitations
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {vendor.risks.map((risk, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-yellow-600">⚠️</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence Links */}
              {vendor.evidenceLinks.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                    📚 Evidence & Sources
                  </h3>
                  <div className="space-y-2">
                    {vendor.evidenceLinks.map((evidence, idx) => (
                      <div key={idx} className="text-sm border-l-2 border-primary pl-3 py-1">
                        <div className="text-xs text-muted-foreground italic mb-1">
                          "{evidence.snippet}"
                        </div>
                        <a 
                          href={evidence.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-xs"
                        >
                          View Source
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
