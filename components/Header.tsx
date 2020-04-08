import Link from 'next-translate/Link'
import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
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
    if (url) {
      return replaceI18n({
        url,
        options: {
          lang: l,
        },
      })
    } else {
      // only in home
      window.location.replace(`${slash}${l}`)
    }
  }

  return (
    <div className="bg-white px-4 py-2 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-xl md:text-2xl">
            <Link href="/">
              <button className="focus:outline-none focus:shadow-outline">
                Coronabingo
              </button>
            </Link>
          </h1>
          <Select
            id="language"
            onChange={onLanguageChange}
            options={languages}
            value={lang}
          />
        </div>
      </div>
    </div>
  )
}
