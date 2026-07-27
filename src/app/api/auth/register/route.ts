import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Nama, email, dan password wajib diisi' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { email, password: hashed, name, phone }
    })

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
