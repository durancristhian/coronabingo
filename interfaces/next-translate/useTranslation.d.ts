declare module 'next-translate/useTranslation' {
  export default function(): {
    lang: string
    t: (key: string, options?: {}) => string
  }
}
