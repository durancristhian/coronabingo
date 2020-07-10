import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode, useEffect, useState } from 'react'
import Banner from '~/components/Banner'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import { useAnalytics } from '~/hooks/useAnalytics'
import useEventBanner from '~/hooks/useEventBanner'
import { version } from '~/package.json'
import { isThereLocalStorageSupport } from '~/utils'
import Box from './Box'
import Container from './Container'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const showEventBanner = useEventBanner()
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
    <main className="bg-gray-200 flex flex-col min-h-screen debug">
      {isStaging && (
        <Banner type="emphasis">{t('common:staging', { version })}</Banner>
      )}
      <Header />
      <div className="flex-auto min-h-screen-50">
        <div className="px-4 py-8">
          <Container size="large">
            <div className="flex flex-col md:flex-row justify-center">
              {showEventBanner && (
                <div className="order-1 md:flex-none md:w-1/3">
                  <div className="pt-8 md:pr-4">
                    <h1>Hola soy un banner piola</h1>
                  </div>
                </div>
              )}
              <div className="flex-auto order-0 md:order-2">
                {renderContent()}
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Footer />
    </main>
  )
}
