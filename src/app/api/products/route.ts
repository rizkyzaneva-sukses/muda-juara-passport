import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const mine = searchParams.get('mine') === '1'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20

  const where: any = { isActive: true }
  if (category) where.category = category
  if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }]

  if (mine) {
    const session = await getSession()
    if (session) where.userId = session.id
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { user: { select: { name: true, region: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const product = await prisma.product.create({ data: { ...data, userId: session.id, price: parseFloat(data.price) } })
  return NextResponse.json({ product })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await prisma.product.delete({ where: { id, userId: session.id } })
  return NextResponse.json({ success: true })
}
