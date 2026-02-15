import axios from 'axios'
import { SearchResult } from '@/types'

const SERP_API_KEY = process.env.SERP_API_KEY
const SERP_API_URL = 'https://serpapi.com/search'

export async function searchWithSerpAPI(query: string, count: number = 10): Promise<SearchResult[]> {
  if (!SERP_API_KEY) {
    throw new Error('SERP_API_KEY is not configured')
  }

  try {
    const response = await axios.get(SERP_API_URL, {
      params: {
        api_key: SERP_API_KEY,
        q: query,
        num: Math.min(count, 10),
        engine: 'google', // Use Google search engine
      },
      timeout: 30000,
    })

    const organicResults = response.data.organic_results || []
    
    return organicResults.map((result: any): SearchResult => ({
      title: result.title || '',
      url: result.link || '',
      snippet: result.snippet || '',
      relevanceScore: result.position || 0,
    }))
  } catch (error: any) {
    console.error('SerpAPI error:', error.message)
    
    // Check for quota exceeded
    if (error.response?.status === 429 || error.response?.data?.error?.includes('limit')) {
      throw new Error('Monthly search quota exceeded (100 searches/month). Please try again next month or upgrade your plan.')
    }
    
    throw new Error(`Search failed: ${error.message}`)
  }
}

export async function searchVendors(need: string, count: number = 10): Promise<SearchResult[]> {
  // Construct search query optimized for finding vendors
  const query = `${need} vendors pricing features comparison`
  return searchWithSerpAPI(query, count)
}

export async function searchVendorPricing(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} pricing plans cost`
  return searchWithSerpAPI(query, 5)
}

export async function searchVendorFeatures(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} features capabilities specifications`
  return searchWithSerpAPI(query, 5)
}

export async function searchVendorReviews(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} reviews limitations problems issues`
  return searchWithSerpAPI(query, 5)
}