import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Container from '~/components/Container'
import CreateRoom from '~/components/CreateRoom'
import Layout from '~/components/Layout'
import Modal from '~/components/Modal'
import YouTube from 'react-youtube'

export default function Index() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

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
        <div className="my-4">
          <span>{t('index:how-to-play-text')} </span>
          <button
            id="how-to-play"
            className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
            onClick={() => {
              setShowModal(true)
            }}
          >
            {t('index:how-to-play-button')}
          </button>
          <span>.</span>
        </div>
        <Modal
          className="modal big"
          id="modal-how-to-play"
          isOpen={showModal}
          onRequestClose={() => {
            setShowModal(false)
          }}
          overlayClassName="overlay"
          title={t('index:how-to-play-modal-title')}
        >
          <YouTube
            videoId={t('index:how-to-play-youtube-id')}
            containerClassName="video-wrapper"
            className="video-iframe"
          />
        </Modal>
      </Container>
    </Layout>
  )
}
