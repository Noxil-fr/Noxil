import { NextResponse } from 'next/server'

export function middleware(request) {
  const auth = request.cookies.get('noxil-auth')
  if (!auth) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/hub/:path*', '/notes/:path*'],
}
