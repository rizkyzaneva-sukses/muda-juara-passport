import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const businesses = await prisma.business.findMany({ where: { userId: session.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ businesses })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const business = await prisma.business.create({ data: { ...data, userId: session.id } })
  return NextResponse.json({ business })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...data } = await req.json()
  const business = await prisma.business.update({ where: { id }, data })
  return NextResponse.json({ business })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  await prisma.business.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
