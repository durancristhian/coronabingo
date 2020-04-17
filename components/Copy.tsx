import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FiCopy, FiShare2 } from 'react-icons/fi'
import Modal from '~/components/Modal'
import Button from './Button'
import ShareButton from './ShareButton'
import Toast from './Toast'

interface Props {
  content: string
}

export default function Share({ content }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const { t } = useTranslation()

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${content}`)
  }

  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${content}`)
  }

  const shareAndClose = (callback?: Function) => {
    setShowModal(false)
    callback?.()
  }

  return (
    <div>
      <Button
        id="open-share-modal"
        className="mb-4"
        onClick={() => setShowModal(true)}
      >
        <FiShare2 />
        <span className="ml-4">{t('common:share-link')}</span>
      </Button>
      <Toast onDismiss={setShowToast} show={showToast} type="success">
        {t('common:copied')}
      </Toast>
      <Modal
        contentLabel="Compartir Link"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="modal"
        overlayClassName="overlay"
        title={t('common:share-link')}
      >
        <div className="flex flex-wrap items-center justify-center">
          <CopyToClipboard text={content}>
            <ShareButton
              Icon={FiCopy}
              iconBgColor="bg-gray-500"
              label={t('common:copy')}
              onClick={() => {
                shareAndClose()
                setShowToast(true)
              }}
            />
          </CopyToClipboard>
          <ShareButton
            Icon={FaWhatsapp}
            iconBgColor="bg-whatsapp"
            label={t('common:whatsapp-share')}
            onClick={() => shareAndClose(shareOnWhatsApp)}
          />
          <ShareButton
            Icon={FaTelegramPlane}
            iconBgColor="bg-telegram"
            label={t('common:telegram-share')}
            onClick={() => shareAndClose(shareOnTelegram)}
          />
        </div>
      </Modal>
    </div>
  )
}
