import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import Heading from '~/components/Heading'
import { allLanguages } from '~/i18n.json'
import Select from './Select'

export default function Header() {
  const { t, lang } = useTranslation()

  const languages = allLanguages.map(l => ({
    id: l,
    name: t(`common:language-${l}`),
  }))

  const onLanguageChange = (l: string) => {
    const { asPath, replaceI18n } = Router
    const slash = '/'
    const url = asPath
      .split(slash)
      .filter(p => p && !allLanguages.includes(p))
      .join(slash)

    return replaceI18n({
      url: url || slash,
      options: {
        lang: l,
      },
    })
  }

  return (
    <header className="bg-white px-4 py-2 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Heading type="h1">Coronabingo</Heading>
          <Select
            id="language"
            onChange={onLanguageChange}
            options={languages}
            value={lang}
          />
        </div>
      </div>
    </header>
  )
}
