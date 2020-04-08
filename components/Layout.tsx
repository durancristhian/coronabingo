import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
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

  return (
    <main className="bg-gray-200 flex flex-col font-inter leading-normal min-h-screen text-gray-900 text-sm md:text-base">
      <Header />
      {playerId && (
        <Banner type="emphasis">
          <span>{t('common:post-your-photo')} </span>
        </Banner>
      )}
      <div className="flex-auto">{children}</div>
      <Banner>
        <span>{t('common:feedback-form.intro')} </span>
        <Anchor href="https://forms.gle/egSBrsKSFnEgabff7">
          {t('common:feedback-form.link')}
        </Anchor>
        <span role="img" aria-label="emoji">
          &nbsp;🤩
        </span>
      </Banner>
      <Footer />
    </main>
  )
}
