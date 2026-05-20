import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { hash } = await request.json()

  if (hash !== process.env.PIN_HASH) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('noxil-auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('noxil-auth')
  return NextResponse.json({ ok: true })
}
