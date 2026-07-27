import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'muda-juara-secret-key-2026')

export interface SessionUser {
  id: string
  email: string
  name: string
  role: string
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed)
}

export async function createToken(user: SessionUser) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('mj_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}
