import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode } from 'react'
import Banner from '~/components/Banner'
import Footer from '~/components/Footer'
import Header from '~/components/Header'
import useLocalStorageSupport from '~/hooks/useLocalStorageSupport'
import { version } from '~/package.json'
import Box from './Box'
import Container from './Container'

interface Props {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const isThereLocalStorageSupport = useLocalStorageSupport()
  const { t } = useTranslation()
  const isStaging = process.env.URL?.toString()
    .split('.')
    .includes('cduran')

  const renderContent = () => {
    if (isThereLocalStorageSupport) return children

    return (
      <Container>
        <Box>
          <p className="text-center">{t('common:no-local-storage-support')}</p>
        </Box>
      </Container>
    )
  }

  return (
    <main className="bg-gray-200 flex flex-col min-h-screen">
      {isStaging && (
        <Banner type="emphasis">{t('common:staging', { version })}</Banner>
      )}
      <Header />
      <div className="flex-auto min-h-screen-50">
        <div className="px-4 py-8">{renderContent()}</div>
      </div>
      <Footer />
    </main>
  )
}
