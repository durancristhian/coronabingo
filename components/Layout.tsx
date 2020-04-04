// @ts-ignore
import useTranslation from 'next-translate/useTranslation'
import { ReactNode } from 'react'
import Banner from './Banner'
import Footer from './Footer'
import Header from './Header'

interface IProps {
  children: ReactNode
}

export default function Layout({ children }: IProps) {
  const { t } = useTranslation()

  return (
    <main className="bg-gray-200 flex flex-col font-inter leading-none min-h-screen text-gray-900">
      <Header />
      <div className="flex-auto">{children}</div>
      <Banner>
        <span>{t('common:feedback-form.intro')} </span>
        <a
          href="https://forms.gle/egSBrsKSFnEgabff7"
          target="_blank"
          rel="noopener noreferrer"
          className="focus:outline-none focus:shadow-outline font-medium text-blue-600 underline"
        >
          {t('common:feedback-form.link')}
        </a>
        <span>&nbsp;🤩</span>
      </Banner>
      <Footer />
    </main>
  )
}