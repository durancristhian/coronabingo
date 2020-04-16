import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Container from '~/components/Container'
import CreateRoom from '~/components/CreateRoom'
import Layout from '~/components/Layout'

export default function Index() {
  const { t } = useTranslation()

  return (
    <Layout>
      <Container>
        <p>{t('index:intro')}</p>
        <div className="my-8">
          <Box>
            <CreateRoom />
          </Box>
        </div>
        <p>
          <span>{t('index:videocall-suggestion')} </span>
          <Anchor href="https://hangouts.google.com/">Google Hangouts</Anchor>
          <span>.</span>
        </p>
      </Container>
    </Layout>
  )
}
