import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || ''

  const where: any = {}
  if (category) where.slug = category

  const categories = await prisma.videoCategory.findMany({
    where,
    include: { videos: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json({ categories })
}
