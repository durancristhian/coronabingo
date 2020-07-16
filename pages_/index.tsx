import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import { FiEye } from 'react-icons/fi'
import YouTube from 'react-youtube'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Button from '~/components/Button'
import CreateRoom from '~/components/CreateRoom'
import Layout from '~/components/Layout'
import Modal from '~/components/Modal'

const videosByLanguage: { [key: string]: string } = {
  en: 'iP0732WuS5E',
  es: 'XJpKBegq5GY',
}

export default function Index() {
  const { t, lang } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  return (
    <Layout>
      <p>{t('index:intro')}</p>
      <div className="my-8">
        <Box>
          <CreateRoom />
        </Box>
      </div>
      <p>
        <span>{t('index:videocall-suggestion')} </span>
        <Anchor href="https://hangouts.google.com/" id="google-hangouts">
          Google Hangouts
        </Anchor>
        <span>.</span>
      </p>
      <div className="mt-8">
        <Button
          aria-label={t('index:how-to-play-button')}
          id="watch-tutorial"
          onClick={() => {
            setShowModal(true)
          }}
          className="w-full"
          iconLeft={<FiEye />}
        >
          {t('index:how-to-play-button')}
        </Button>
      </div>
      <Modal
        id="modal-how-to-play"
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false)
        }}
        className="modal wide"
        overlayClassName="overlay"
        title={t('index:how-to-play-modal-title')}
        contentLabel={t('index:how-to-play-modal-title')}
      >
        <YouTube
          videoId={videosByLanguage[lang]}
          containerClassName="video-wrapper"
          className="video-iframe"
        />
      </Modal>
    </Layout>
  )
}
