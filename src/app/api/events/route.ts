import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { v4 as uuid } from 'uuid'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const mine = searchParams.get('mine') === '1'

  if (id) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: { include: { user: { select: { name: true, email: true } } } },
        _count: { select: { registrations: true } },
      },
    })
    return NextResponse.json({ event })
  }

  const where: any = { isActive: true }
  if (mine) {
    const session = await getSession()
    if (session) {
      where.registrations = { some: { userId: session.id } }
    }
  }

  const events = await prisma.event.findMany({
    where,
    include: { _count: { select: { registrations: true } } },
    orderBy: { startDate: 'asc' },
  })

  return NextResponse.json({ events })
}
