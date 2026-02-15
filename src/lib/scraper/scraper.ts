import axios from 'axios'
import * as cheerio from 'cheerio'
import { ScrapedData } from '@/types'

const TIMEOUT = parseInt(process.env.SCRAPING_TIMEOUT_MS || '10000')

interface ScrapeOptions {
  timeout?: number
  headers?: Record<string, string>
}

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
}

export async function scrapeWebsite(url: string, options: ScrapeOptions = {}): Promise<ScrapedData> {
  try {
    const response = await axios.get(url, {
      headers: { ...DEFAULT_HEADERS, ...options.headers },
      timeout: options.timeout || TIMEOUT,
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)
    
    // Remove script and style tags
    $('script, style, nav, footer, header').remove()
    
    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled'
    
    // Extract main content
    const content = extractMainContent($)
    
    // Try to extract pricing information
    const pricing = extractPricing($)
    
    // Try to extract features
    const features = extractFeatures($)
    
    return {
      url,
      title,
      content,
      pricing,
      features,
      metadata: {
        scrapedAt: new Date().toISOString(),
        contentLength: content.length,
      }
    }
  } catch (error: any) {
    console.error(`Scraping error for ${url}:`, error.message)
    throw new Error(`Failed to scrape ${url}: ${error.message}`)
  }
}

function extractMainContent($: cheerio.CheerioAPI): string {
  // Try common content selectors
  const selectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '#content',
    '.main-content',
    'body',
  ]
  
  for (const selector of selectors) {
    const element = $(selector).first()
    if (element.length > 0) {
      return element.text().replace(/\s+/g, ' ').trim().slice(0, 5000)
    }
  }
  
  return $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000)
}

function extractPricing($: cheerio.CheerioAPI): ScrapedData['pricing'] | undefined {
  const pricingKeywords = ['pricing', 'price', 'plan', 'cost', '$', '€', '£', 'free', 'paid']
  
  // Look for pricing sections
  const pricingElements = $('*').filter((_, el) => {
    const text = $(el).text().toLowerCase()
    return pricingKeywords.some(keyword => text.includes(keyword))
  })
  
  if (pricingElements.length > 0) {
    const text = pricingElements.first().text().replace(/\s+/g, ' ').trim()
    
    // Extract price range
    const priceMatches = text.match(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g)
    
    return {
      model: extractPricingModel(text),
      range: priceMatches ? priceMatches.join(' - ') : 'See website',
      currency: 'USD',
    }
  }
  
  return undefined
}

function extractPricingModel(text: string): string {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('per user') || lowerText.includes('per seat')) return 'Per User'
  if (lowerText.includes('per month')) return 'Monthly'
  if (lowerText.includes('per year') || lowerText.includes('annual')) return 'Annual'
  if (lowerText.includes('usage') || lowerText.includes('pay as you go')) return 'Usage-based'
  if (lowerText.includes('free')) return 'Freemium'
  if (lowerText.includes('tier')) return 'Tiered'
  
  return 'Contact Sales'
}

function extractFeatures($: cheerio.CheerioAPI): string[] {
  const features: string[] = []
  
  // Look for common feature list patterns
  const featureLists = $('ul, ol').filter((_, el) => {
    const text = $(el).text().toLowerCase()
    return text.includes('feature') || text.includes('include') || text.includes('capability')
  })
  
  featureLists.each((_, list) => {
    $(list).find('li').each((_, item) => {
      const feature = $(item).text().trim()
      if (feature && feature.length < 200 && !feature.toLowerCase().includes('learn more')) {
        features.push(feature)
      }
    })
  })
  
  return features.slice(0, 10) // Limit to top 10 features
}

export async function scrapeMultipleUrls(urls: string[]): Promise<ScrapedData[]> {
  const results = await Promise.allSettled(
    urls.map(url => scrapeWebsite(url))
  )
  
  return results
    .filter((result): result is PromiseFulfilledResult<ScrapedData> => result.status === 'fulfilled')
    .map(result => result.value)
}
