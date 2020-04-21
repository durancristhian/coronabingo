import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React from 'react'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Select from '~/components/Select'
import { allLanguages } from '~/i18n.json'

export default function Header() {
  const { t, lang } = useTranslation()
  const router = useRouter()

  const languages = allLanguages.map(l => ({
    id: l,
    name: t(`common:language-${l}`),
  }))

  const onLanguageChange = (l: string) => {
    const slash = '/'
    const url = router.asPath
      .split(slash)
      .filter(p => p && !allLanguages.includes(p))
      .join(slash)

    return Router.replaceI18n({
      url: url || slash,
      options: {
        lang: l,
      },
    })
  }

  /*
    By default, next-translate adds the default language (es) to the URL
    and we want to avoid that only in the home page
  */
  const href = router.asPath === '/' ? '/' : `/${lang}`

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
