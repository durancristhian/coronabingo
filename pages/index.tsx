import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Box from '~/components/Box'
import Button from '~/components/Button'
import CreateRoom from '~/components/CreateRoom'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Modal from '~/components/Modal'
import { getTutorialEventParams } from '~/utils/analyticsEvents'
import { logEvent as log } from '~/utils/gtag'

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

const TutorialVideo = dynamic(() => import('~/components/TutorialVideo'), {
  loading: TutorialLoading,
})

export default function Index() {
  const { t, lang } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const openTutorial = () => {
    log('tutorial_opened', getTutorialEventParams(lang))
    setShowModal(true)
  }

  return (
    <Layout>
      <p className="cb-home-intro">{t('index:intro')}</p>
      <p className="cb-home-description">{t('index:description')}</p>
      <div className="cb-home-card my-8">
        <Box>
          <CreateRoom />
        </Box>
      </div>
      <p className="cb-home-note">
        <span>{t('index:videocall-suggestion')} </span>
        <Anchor href="https://meet.google.com/" id="google-hangouts">
          Google Meet
        </Anchor>
        <span>.</span>
      </p>
      <div className="cb-home-tutorial mt-8">
        <Button
          aria-label={t('index:how-to-play-button')}
          id="watch-tutorial"
          onClick={openTutorial}
          className="w-full"
          iconLeft={<FiPlayCircle />}
        >
          {t('index:how-to-play-button')}
        </Button>
      </div>
      <div className="cb-home-help">
        <section className="cb-home-section">
          <Heading type="h2">{t('index:how-to-play.title')}</Heading>
          <ol className="cb-home-steps">
            {['prepare', 'share', 'play'].map(step => (
              <li key={step}>
                <Heading type="h3">
                  {t(`index:how-to-play.${step}.title`)}
                </Heading>
                <p>{t(`index:how-to-play.${step}.description`)}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="cb-home-section">
          <Heading type="h2">{t('index:faq.title')}</Heading>
          <dl className="cb-home-faq">
            {['free', 'join', 'draw', 'remote'].map(question => (
              <div key={question}>
                <dt>{t(`index:faq.${question}.question`)}</dt>
                <dd>{t(`index:faq.${question}.answer`)}</dd>
              </div>
            ))}
          </dl>
        </section>
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
        {showModal && <TutorialVideo key={lang} />}
      </Modal>
    </Layout>
  )
}
