import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const region = searchParams.get('region') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const skip = (page - 1) * limit

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { region: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (region) where.region = { contains: region, mode: 'insensitive' }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, region: true, avatar: true, instagram: true, bio: true, createdAt: true, businesses: { select: { name: true, category: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, total, pages: Math.ceil(total / limit), page })
}
