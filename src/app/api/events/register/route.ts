import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { v4 as uuid } from 'uuid'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { eventId } = await req.json()
  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) return NextResponse.json({ error: 'Event tidak ditemukan' }, { status: 404 })

  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId: session.id } },
  })
  if (existing) return NextResponse.json({ error: 'Sudah terdaftar' }, { status: 400 })

  const count = await prisma.eventRegistration.count({ where: { eventId } })
  if (count >= event.quota) return NextResponse.json({ error: 'Kuota penuh' }, { status: 400 })

  const ticketCode = uuid().replace(/-/g, '').substring(0, 8).toUpperCase()

  const registration = await prisma.eventRegistration.create({
    data: { eventId, userId: session.id, ticketCode, status: 'CONFIRMED' },
  })

  return NextResponse.json({ registration, ticketCode })
}
