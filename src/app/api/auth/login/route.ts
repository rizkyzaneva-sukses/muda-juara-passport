import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })

    res.cookies.set('mj_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return res
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
