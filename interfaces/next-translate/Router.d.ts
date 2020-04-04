declare module 'next-translate/Router' {
  export const asPath: string
  export const route: string
  export function pushI18n(url: string | {}, as?: string, options?: {})
  export function replaceI18n(url: string | {}, as?: string, options?: {})
}
