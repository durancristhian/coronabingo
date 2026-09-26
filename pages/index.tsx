import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { FiEye } from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Button from '~/components/Button'
import CreateRoom from '~/components/CreateRoom'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Modal from '~/components/Modal'

interface TutorialLoadingProps {
  error?: Error | null
  retry?: () => void
}

function TutorialLoading({ error, retry }: TutorialLoadingProps) {
  const { t } = useTranslation()

  if (error) {
    return (
      <div className="text-center" role="alert">
        <p>{t('index:tutorial-load-error')}</p>
        <button
          type="button"
          className="mt-4 focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
          onClick={retry}
        >
          {t('index:tutorial-retry')}
        </button>
      </div>
    )
  }

  return (
    <div role="status">
      <Loading message={t('index:tutorial-loading')} />
    </div>
  )
}

const YouTube = dynamic(() => import('react-youtube'), {
  loading: TutorialLoading,
})

const videosByLanguage: { [key: string]: string } = {
  en: 'iP0732WuS5E',
  es: 'XJpKBegq5GY',
}

export default function Index() {
  const { t, lang } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [tutorialError, setTutorialError] = useState(false)
  const videoId = videosByLanguage[lang] || videosByLanguage.es

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
        {showModal && tutorialError && (
          <div className="text-center" role="alert">
            <p>{t('index:tutorial-load-error')}</p>
            <Anchor
              href={`https://www.youtube.com/watch?v=${videoId}`}
              id="tutorial-youtube-fallback"
            >
              {t('index:tutorial-open-youtube')}
            </Anchor>
          </div>
        )}
        {showModal && !tutorialError && (
          <YouTube
            videoId={videoId}
            containerClassName="video-wrapper"
            className="video-iframe"
            onError={() => setTutorialError(true)}
          />
        )}
      </Modal>
    </Layout>
  )
}
