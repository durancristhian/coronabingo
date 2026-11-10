import { describe, expect, it } from 'vitest'
import { negotiateContent } from '~/utils/negotiateContent'

describe('public representation negotiation', () => {
  it.each([
    [undefined, 'text/html'],
    ['*/*', 'text/html'],
    ['text/*', 'text/html'],
    ['text/markdown', 'text/markdown'],
    ['TEXT/MARKDOWN', 'text/markdown'],
    ['text/html', 'text/html'],
    ['text/markdown;q=0, text/html', 'text/html'],
    ['text/markdown;q=0, */*', 'text/html'],
    ['text/html;q=0, text/*;q=0.5', 'text/markdown'],
    ['text/markdown;q=0.5, text/html;q=0.8', 'text/html'],
    ['text/markdown, text/html;q=0.8', 'text/markdown'],
    ['application/json', undefined],
    ['text/markdown;q=0, text/html;q=0', undefined],
    [
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'text/html',
    ],
  ])('negotiates %s as %s', (accept, type) => {
    expect(negotiateContent(accept)).toBe(type)
  })
})
