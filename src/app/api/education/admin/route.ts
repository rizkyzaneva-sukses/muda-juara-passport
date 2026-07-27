import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()

  // Create or find category
  let category = await prisma.videoCategory.findUnique({ where: { slug: data.categorySlug } })
  if (!category) {
    category = await prisma.videoCategory.create({
      data: { name: data.categoryName, slug: data.categorySlug }
    })
  }

  const video = await prisma.video.create({
    data: {
      categoryId: category.id,
      title: data.title,
      description: data.description,
      youtubeUrl: data.youtubeUrl,
      duration: data.duration,
    }
  })

  return NextResponse.json({ video })
}
