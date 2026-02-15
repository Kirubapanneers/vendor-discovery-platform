import axios from 'axios'
import { SearchResult } from '@/types'

const BRAVE_SEARCH_API_KEY = process.env.BRAVE_SEARCH_API_KEY
const BRAVE_API_URL = 'https://api.search.brave.com/res/v1/web/search'

export async function searchWithBrave(query: string, count: number = 10): Promise<SearchResult[]> {
  if (!BRAVE_SEARCH_API_KEY) {
    throw new Error('BRAVE_SEARCH_API_KEY is not configured')
  }

  try {
    const response = await axios.get(BRAVE_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': BRAVE_SEARCH_API_KEY,
      },
      params: {
        q: query,
        count: count,
        search_lang: 'en',
        safesearch: 'moderate',
      },
      timeout: 10000,
    })

    const results = response.data.web?.results || []
    
    return results.map((result: any): SearchResult => ({
      title: result.title || '',
      url: result.url || '',
      snippet: result.description || '',
      relevanceScore: result.page_age_rank || 0,
    }))
  } catch (error: any) {
    console.error('Brave Search API error:', error.message)
    throw new Error(`Search failed: ${error.message}`)
  }
}

export async function searchVendors(need: string, count: number = 10): Promise<SearchResult[]> {
  // Construct search query optimized for finding vendors
  const query = `${need} vendors pricing features comparison`
  return searchWithBrave(query, count)
}

export async function searchVendorPricing(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} pricing plans cost`
  return searchWithBrave(query, 5)
}

export async function searchVendorFeatures(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} features capabilities specifications`
  return searchWithBrave(query, 5)
}

export async function searchVendorReviews(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} reviews limitations problems issues`
  return searchWithBrave(query, 5)
}
