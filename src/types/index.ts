// Core types for the Vendor Discovery Platform

export interface Requirement {
  id: string
  description: string
  priority: 'must-have' | 'nice-to-have' | 'optional'
  weight?: number // 1-10 scale for weighted scoring
}

export interface VendorInput {
  need: string
  requirements: Requirement[]
  excludeVendors?: string[]
  maxVendors?: number
}

export interface Evidence {
  url: string
  snippet: string
  relevance: 'high' | 'medium' | 'low'
  timestamp: string
}

export interface VendorComparison {
  name: string
  website: string
  description: string
  priceRange: string
  pricingModel: string
  currency: string
  keyFeatures: string[]
  matchedRequirements: {
    requirement: string
    met: boolean
    evidence: string
  }[]
  risks: string[]
  evidenceLinks: Evidence[]
  overallScore: number
  requirementMatch: number
}

export interface ShortlistResult {
  id: string
  needDescription: string
  requirements: Requirement[]
  vendors: VendorComparison[]
  processingTime: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  errorMessage?: string
}

export interface HealthStatus {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime?: number
  message?: string
  timestamp: string
}

export interface SearchResult {
  title: string
  url: string
  snippet: string
  relevanceScore?: number
}

export interface ScrapedData {
  url: string
  title: string
  content: string
  pricing?: {
    model: string
    range: string
    currency: string
  }
  features?: string[]
  metadata?: Record<string, any>
}
