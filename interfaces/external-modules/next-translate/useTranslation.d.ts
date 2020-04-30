declare module 'next-translate/useTranslation' {
  export default function useTranslation(): {
    lang: string
    t: (key: string, query?: { [name: string]: string | number }) => string
  }
}
