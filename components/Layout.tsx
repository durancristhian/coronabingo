import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { version } from '~/package.json'
import Anchor from './Anchor'
import Banner from './Banner'
import Footer from './Footer'
import Header from './Header'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const playerId = router.query.playerId?.toString()
  const isStaging =
    typeof window !== 'undefined'
      ? window.location.hostname.split('.').includes('cduran')
      : false

  return (
    <main className="bg-gray-200 flex flex-col font-sans leading-normal min-h-screen text-gray-900 text-sm md:text-base">
      {isStaging && (
        <Banner type="emphasis">{t('common:staging', { version })}</Banner>
      )}
      <Header />
      {playerId && (
        <Banner type="emphasis">{t('common:post-your-photo')}</Banner>
      )}
      <div className="flex-auto">
        <div className="px-4 py-8">{children}</div>
      </div>
      <Banner>
        <span className="mr-1">{t('common:feedback-form.intro')}</span>
        <Anchor href="https://forms.gle/egSBrsKSFnEgabff7">
          <span className="mr-1">{t('common:feedback-form.link')}</span>
        </Anchor>
        <i
          className="em em-star-struck"
          tabIndex={-1}
          aria-label="Grinning face with star eyes"
        ></i>
      </Banner>
      <Footer />
    </main>
  )
}
