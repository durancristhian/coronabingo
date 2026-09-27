import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React from 'react'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Select from '~/components/Select'
import { useAnalytics } from '~/hooks/useAnalytics'
import i18n from '~/i18n.json'
import { getLanguageChangedEventParams } from '~/utils/analyticsEvents'

const allLanguages = i18n.locales

export default function Header() {
  const { t, lang } = useTranslation()
  const log = useAnalytics()
  const router = useRouter()

  const languages = allLanguages.map(l => ({
    id: l,
    name: t(`common:language-${l}`),
  }))

  const onLanguageChange = async (nextLanguage: string) => {
    if (nextLanguage === lang) return

    const didNavigate = await router.replace(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: nextLanguage },
    )

    if (!didNavigate) return

    log(
      'language_changed',
      getLanguageChangedEventParams({
        fromLanguage: lang,
        pathname: router.pathname,
        toLanguage: nextLanguage,
      }),
    )
  }

  const href = lang === i18n.defaultLocale ? '/' : `/${lang}`

  return (
    <header className="bg-white px-4 py-2 shadow">
      <Container size="large">
        <div className="flex items-center justify-between">
          <Heading type="h1">
            <a
              href={href}
              className="duration-150 ease-in-out focus:outline-none focus:shadow-outline outline-none transition"
            >
              Coronabingo
            </a>
          </Heading>
          <Select
            id="language"
            onChange={onLanguageChange}
            options={languages}
            value={lang}
          />
        </div>
      </Container>
    </header>
  )
}
