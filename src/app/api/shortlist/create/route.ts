import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { searchVendors } from '@/lib/search/serpapi'
import { scrapeMultipleUrls } from '@/lib/scraper/scraper'
import { analyzeVendors } from '@/lib/ai/gemini'
import { Requirement } from '@/types'
import { Prisma } from '@prisma/client'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { need, requirements } = body as {
      need: string
      requirements: Requirement[]
    }

    if (!need || !requirements || requirements.length === 0) {
      return NextResponse.json(
        { error: 'Need and requirements are required' },
        { status: 400 }
      )
    }

    const shortlist = await prisma.shortlist.create({
      data: {
        needDescription: need,
        requirements: requirements as Prisma.InputJsonValue,
        status: 'processing',
      },
    })

    console.log('🔍 Searching for vendors...')
    const searchResults = await searchVendors(need, 10)
    
    if (searchResults.length === 0) {
      await prisma.shortlist.update({
        where: { id: shortlist.id },
        data: {
          status: 'failed',
          errorMessage: 'No vendors found for this search',
        },
      })
      
      return NextResponse.json(
        { error: 'No vendors found. Try rephrasing your need.' },
        { status: 404 }
      )
    }

    console.log('🌐 Scraping vendor websites...')
    const urlsToScrape = searchResults.slice(0, 6).map(r => r.url)
    const scrapedData = await scrapeMultipleUrls(urlsToScrape)

    if (scrapedData.length === 0) {
      await prisma.shortlist.update({
        where: { id: shortlist.id },
        data: {
          status: 'failed',
          errorMessage: 'Failed to scrape vendor websites',
        },
      })
      
      return NextResponse.json(
        { error: 'Failed to gather vendor information' },
        { status: 500 }
      )
    }

    console.log('🤖 Analyzing vendors with AI...')
    const vendorAnalysis = await analyzeVendors(need, requirements, scrapedData)

    const vendorRecords = await Promise.all(
      vendorAnalysis.map(vendor =>
        prisma.vendor.create({
          data: {
            shortlistId: shortlist.id,
            name: vendor.name,
            website: vendor.website,
            description: vendor.description,
            priceRange: vendor.priceRange,
            pricingModel: vendor.pricingModel,
            currency: vendor.currency,
            keyFeatures: vendor.keyFeatures,
            matchedRequirements: vendor.matchedRequirements as Prisma.InputJsonValue,
            risks: vendor.risks,
            evidenceLinks: vendor.evidenceLinks as Prisma.InputJsonValue,
            overallScore: vendor.overallScore,
            requirementMatch: vendor.requirementMatch,
          },
        })
      )
    )

    const processingTime = Date.now() - startTime
    const updatedShortlist = await prisma.shortlist.update({
      where: { id: shortlist.id },
      data: {
        status: 'completed',
        processingTime,
      },
      include: {
        vendors: {
          orderBy: {
            overallScore: 'desc',
          },
        },
      },
    })

    console.log(`✅ Shortlist created in ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      shortlist: updatedShortlist,
      processingTime,
    })

  } catch (error: any) {
    console.error('Error creating shortlist:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create shortlist',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}