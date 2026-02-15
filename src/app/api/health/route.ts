import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import axios from 'axios'

interface ServiceHealth {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime?: number
  message?: string
}

export async function GET() {
  const results: ServiceHealth[] = []

  // Check Database
  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    results.push({
      service: 'Database',
      status: 'healthy',
      responseTime: Date.now() - dbStart,
      message: 'PostgreSQL connection successful',
    })
  } catch (error: any) {
    results.push({
      service: 'Database',
      status: 'down',
      message: error.message,
    })
  }

  // Check Google Gemini API
  const geminiStart = Date.now()
  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY not configured')
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: 'ping'
          }]
        }]
      },
      { timeout: 10000 }
    )

    results.push({
      service: 'Google Gemini AI',
      status: 'healthy',
      responseTime: Date.now() - geminiStart,
      message: 'Gemini API responding',
    })
  } catch (error: any) {
    results.push({
      service: 'Google Gemini AI',
      status: 'down',
      message: error.message || 'API key invalid',
    })
  }

  // Check SerpAPI
  const serpStart = Date.now()
  try {
    if (!process.env.SERP_API_KEY) {
      throw new Error('SERP_API_KEY not configured')
    }

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        api_key: process.env.SERP_API_KEY,
        q: 'test',
        num: 1,
        engine: 'google',
      },
      timeout: 10000,
    })

    results.push({
      service: 'SerpAPI Search',
      status: 'healthy',
      responseTime: Date.now() - serpStart,
      message: 'Search API responding',
    })
  } catch (error: any) {
    results.push({
      service: 'SerpAPI Search',
      status: 'down',
      message: error.message || 'API key invalid or quota exceeded',
    })
  }

  // Determine overall health
  const allHealthy = results.every(r => r.status === 'healthy')
  const anyDown = results.some(r => r.status === 'down')

  // Save health check
  try {
    await Promise.all(
      results.map(result =>
        prisma.healthCheck.create({
          data: {
            service: result.service,
            status: result.status,
            responseTime: result.responseTime,
            errorMessage: result.message,
          },
        })
      )
    )
  } catch (error) {
    console.error('Failed to save health check:', error)
  }

  return NextResponse.json({
    status: anyDown ? 'unhealthy' : allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: results,
  })
}