import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode, useEffect, useState } from 'react'
import Banner from '~/components/Banner'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { useAnalytics } from '~/hooks/useAnalytics'
import { version } from '~/package.json'
import { isThereLocalStorageSupport } from '~/utils'
import Box from './Box'
import Container from './Container'
import EventBanner from './EventBanner'

interface Props {
  children: ReactNode
  type?: 'medium' | 'large'
}

export default function Layout({ children, type = 'medium' }: Props) {
  const log = useAnalytics()
  const [localStorageSupport, setLocalStorageSupport] = useState(true)
  const { t } = useTranslation()
  const isStaging = process.env.URL?.toString()
    .split('.')
    .includes('cduran')

  useEffect(() => {
    if (!isThereLocalStorageSupport()) {
      setLocalStorageSupport(false)
    }
  }, [])

  const renderContent = () => {
    if (localStorageSupport) {
      return children
    }

    log('no_local_storage_support', {
      description: `${localStorageSupport}`,
    })

    return (
      <Box>
        <p className="text-center">{t('common:no-local-storage-support')}</p>
      </Box>
    )
  }

  return (
    <main className="bg-gray-200 flex flex-col min-h-screen">
      {isStaging && (
        <Banner type="emphasis">{t('common:staging', { version })}</Banner>
      )}
      <Header />
      <div className="flex-auto min-h-650px">
        <div className="px-4 py-8">
          <Container size={type}>{renderContent()}</Container>
        </div>
      </div>
      <EventBanner />
      <Footer />
    </main>
  )
}
