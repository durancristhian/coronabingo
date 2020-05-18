import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode } from 'react'
import Anchor from '~/components/Anchor'
import Banner from '~/components/Banner'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { version } from '~/package.json'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const { t } = useTranslation()
  const isStaging = process.env.URL?.toString()
    .split('.')
    .includes('cduran')

  return (
    <main className="bg-gray-200 flex flex-col min-h-screen">
      {isStaging && (
        <Banner type="emphasis">{t('common:staging', { version })}</Banner>
      )}
      <Header />
      <div className="flex-auto">
        <div className="px-4 py-8">{children}</div>
      </div>
      <Banner>
        <span className="mr-1">
          <span className="mr-1">{t('common:feedback-form.intro')}</span>
          <Anchor href="https://forms.gle/egSBrsKSFnEgabff7" id="feedback-form">
            {t('common:feedback-form.link')}
          </Anchor>
        </span>
      </Banner>
      <Footer />
    </main>
  )
}
