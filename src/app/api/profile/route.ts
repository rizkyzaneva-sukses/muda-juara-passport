import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: session.id }, include: { businesses: true } })
  return NextResponse.json({ user })
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const { name, phone, bio, gender, region, address, province, city, district, village, rtRw, facebook, instagram, twitter, website } = data
  const user = await prisma.user.update({
    where: { id: session.id },
    data: { name, phone, bio, gender, region, address, province, city, district, village, rtRw, facebook, instagram, twitter, website }
  })
  return NextResponse.json({ user })
}
