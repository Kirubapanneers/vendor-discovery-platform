import axios from 'axios'
import { SearchResult } from '@/types'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID
const GOOGLE_SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1'

export async function searchWithGoogle(query: string, count: number = 10): Promise<SearchResult[]> {
  if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not configured')
  }

  if (!GOOGLE_SEARCH_ENGINE_ID) {
    throw new Error('GOOGLE_SEARCH_ENGINE_ID is not configured')
  }

  try {
    const response = await axios.get(GOOGLE_SEARCH_API_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        num: Math.min(count, 10),
      },
      timeout: 10000,
    })

    const items = response.data.items || []
    
    return items.map((item: any): SearchResult => ({
      title: item.title || '',
      url: item.link || '',
      snippet: item.snippet || '',
      relevanceScore: 1,
    }))
  } catch (error: any) {
    console.error('Google Custom Search API error:', error.message)
    
    if (error.response?.status === 429) {
      throw new Error('Daily search quota exceeded (100 searches/day). Please try again tomorrow.')
    }
    
    throw new Error(`Search failed: ${error.message}`)
  }
}

export async function searchVendors(need: string, count: number = 10): Promise<SearchResult[]> {
  const query = `${need} vendors pricing features comparison`
  return searchWithGoogle(query, count)
}

export async function searchVendorPricing(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} pricing plans cost`
  return searchWithGoogle(query, 5)
}

export async function searchVendorFeatures(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} features capabilities specifications`
  return searchWithGoogle(query, 5)
}

export async function searchVendorReviews(vendorName: string): Promise<SearchResult[]> {
  const query = `${vendorName} reviews limitations problems issues`
  return searchWithGoogle(query, 5)
}