import { VendorComparison, Requirement, ScrapedData } from '@/types'

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function analyzeVendors(
  need: string,
  requirements: Requirement[],
  scrapedData: ScrapedData[]
): Promise<VendorComparison[]> {
  
  if (!GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
  }

  const prompt = buildAnalysisPrompt(need, requirements, scrapedData)
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Gemini API error: ${response.status} ${error}`)
    }

    const data = await response.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    // Parse the JSON response
    const parsed = parseVendorAnalysis(responseText)
    return parsed
    
  } catch (error: any) {
    console.error('Gemini API error:', error.message)
    throw new Error(`AI analysis failed: ${error.message}`)
  }
}

function buildAnalysisPrompt(
  need: string,
  requirements: Requirement[],
  scrapedData: ScrapedData[]
): string {
  const requirementsText = requirements.map((req, idx) => 
    `${idx + 1}. [${req.priority.toUpperCase()}] ${req.description} (Weight: ${req.weight || 5}/10)`
  ).join('\n')
  
  const vendorDataText = scrapedData.map((data, idx) => `
=== VENDOR ${idx + 1}: ${data.title} ===
Website: ${data.url}
Content: ${data.content.slice(0, 2000)}
${data.pricing ? `Pricing: ${JSON.stringify(data.pricing)}` : ''}
${data.features ? `Features: ${data.features.join(', ')}` : ''}
  `).join('\n\n')
  
  return `You are a vendor analysis expert. Analyze these vendors for the following need and requirements.

NEED: ${need}

REQUIREMENTS:
${requirementsText}

VENDOR DATA:
${vendorDataText}

Your task:
1. For each vendor, analyze how well they meet the requirements
2. Extract pricing information (range, model, currency)
3. Identify key features that match the requirements
4. Note any risks, limitations, or concerns
5. Provide evidence (quotes from the content) for your analysis
6. Score each vendor (0-100) based on requirement match

Return your analysis as a JSON array with this EXACT structure:
[
  {
    "name": "Vendor Name",
    "website": "https://...",
    "description": "Brief description",
    "priceRange": "$10-50/month or Contact Sales",
    "pricingModel": "Per User/Monthly/Annual/Usage-based/Freemium",
    "currency": "USD",
    "keyFeatures": ["feature1", "feature2", "feature3"],
    "matchedRequirements": [
      {
        "requirement": "requirement description",
        "met": true,
        "evidence": "Quote from content showing this"
      }
    ],
    "risks": ["risk1", "risk2"],
    "evidenceLinks": [
      {
        "url": "source url",
        "snippet": "relevant quote",
        "relevance": "high",
        "timestamp": "${new Date().toISOString()}"
      }
    ],
    "overallScore": 85,
    "requirementMatch": 90
  }
]

IMPORTANT:
- Only include vendors that are clearly relevant to the need
- Be honest about limitations and risks
- Use actual quotes from the content as evidence
- If pricing is not found, use "Contact Sales"
- Scores should be realistic (50-95 range)
- Return ONLY valid JSON, no markdown formatting, no backticks, no explanation`
}

function parseVendorAnalysis(responseText: string): VendorComparison[] {
  try {
    // Remove markdown code blocks if present
    let cleaned = responseText.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```\n?/g, '')
    }
    
    const parsed = JSON.parse(cleaned)
    
    // Validate structure
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array')
    }
    
    return parsed.map(vendor => ({
      name: vendor.name || 'Unknown Vendor',
      website: vendor.website || '',
      description: vendor.description || '',
      priceRange: vendor.priceRange || 'Contact Sales',
      pricingModel: vendor.pricingModel || 'Contact Sales',
      currency: vendor.currency || 'USD',
      keyFeatures: vendor.keyFeatures || [],
      matchedRequirements: vendor.matchedRequirements || [],
      risks: vendor.risks || [],
      evidenceLinks: vendor.evidenceLinks || [],
      overallScore: vendor.overallScore || 0,
      requirementMatch: vendor.requirementMatch || 0,
    }))
  } catch (error: any) {
    console.error('Failed to parse vendor analysis:', error.message)
    console.error('Response text:', responseText)
    throw new Error(`Failed to parse AI response: ${error.message}`)
  }
}

export async function generateVendorSuggestions(need: string): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not configured')
  }

  const prompt = `Given this need: "${need}"

Suggest 5-8 well-known vendors/services that could fulfill this need. 
Return ONLY a JSON array of vendor names, nothing else.

Example format: ["Vendor1", "Vendor2", "Vendor3"]`

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'
    
    let cleaned = responseText.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
    }
    
    return JSON.parse(cleaned)
  } catch (error: any) {
    console.error('Failed to generate vendor suggestions:', error.message)
    return []
  }
}