// @ts-ignore
import useTranslation from 'next-translate/useTranslation'

export default function Header() {
  const { t, lang } = useTranslation()

  return (
    <div className="bg-white p-4 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center">
          <h1 className="font-medium text-2xl">
            <a href="/" className="focus:outline-none focus:shadow-outline">
              Coronabingo
            </a>
          </h1>
          <p>
            {lang} - {t('common:title')}
          </p>
        </div>
      </div>
    </div>
  )
}
