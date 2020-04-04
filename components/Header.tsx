import Link from 'next-translate/Link'
import Router from 'next-translate/Router'
import useTranslation from 'next-translate/useTranslation'
import { allLanguages } from '~/i18n.json'
import Select from './Select'

export default function Header() {
  const { t, lang } = useTranslation()

  const languages = allLanguages.map(l => ({
    id: l,
    name: t(`common:language-${l}`)
  }))

  const onLanguageChange = (l: string) => {
    const { asPath, route, replaceI18n } = Router
    const slash = '/'
    const getPath = (path: string) =>
      path
        .split(slash)
        .slice(2)
        .join(slash) || slash

    replaceI18n({
      url: getPath(route),
      as: getPath(asPath),
      options: {
        lang: l
      }
    })
  }

  return (
    <div className="bg-white px-4 py-2 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-2xl">
            <Link href="/">
              <a className="focus:outline-none focus:shadow-outline">
                Coronabingo
              </a>
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
