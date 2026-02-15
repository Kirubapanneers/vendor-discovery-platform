import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    const shortlists = await prisma.shortlist.findMany({
      where: {
        status: 'completed',
      },
      include: {
        vendors: {
          orderBy: {
            overallScore: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      shortlists,
      count: shortlists.length,
    })
  } catch (error: any) {
    console.error('Error fetching shortlist history:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch shortlist history' },
      { status: 500 }
    )
  }
}
