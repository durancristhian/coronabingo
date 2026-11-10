import { NextRequest, NextResponse } from 'next/server'
import { negotiatedHeaders, negotiateContent } from './utils/negotiateContent'
import { publicMarkdown } from './utils/publicContent'

export function proxy(request: NextRequest) {
  if (!['GET', 'HEAD'].includes(request.method)) return NextResponse.next()
  const type = negotiateContent(request.headers.get('accept') ?? undefined)
  const response =
    type === 'text/html'
      ? NextResponse.next()
      : new NextResponse(
          request.method === 'HEAD'
            ? null
            : type
            ? publicMarkdown(request.nextUrl.pathname, request.nextUrl.locale)
            : 'Available representations: text/html, text/markdown.\n',
          {
            status: type ? 200 : 406,
            headers: {
              'Content-Type': `${type || 'text/plain'}; charset=utf-8`,
            },
          },
        )
  for (const [name, value] of Object.entries(negotiatedHeaders))
    response.headers.set(name, value)
  return response
}

export const config = { matcher: ['/', '/about', '/contact', '/privacy'] }
