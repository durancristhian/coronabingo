import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FiCopy, FiShare2 } from 'react-icons/fi'
import Button from '~/components/Button'
import Modal from '~/components/Modal'
import RoundedButton from '~/components/RoundedButton'
import useToast from '~/hooks/useToast'
import { sendWhatsApp } from '~/utils'

interface Props {
  content: string
}

export default function Share({ content }: Props) {
  const [showModal, setShowModal] = useState(false)
  const { createToast, dismissToast } = useToast()
  const { t } = useTranslation()

  const shareOnWhatsApp = () => {
    setShowModal(false)

    sendWhatsApp(content)
  }

  const shareOnTelegram = () => {
    setShowModal(false)

    window.open(`https://t.me/share/url?url=${content}`)
  }

  const showToast = () => {
    setShowModal(false)

    const toastId = createToast('common:copied', 'information')

    setTimeout(() => {
      dismissToast(toastId)
    }, 2000)
  }

  return (
    <Fragment>
      <Button
        aria-label={t('common:share-link')}
        id="open-share-modal"
        onClick={() => setShowModal(true)}
        iconLeft={<FiShare2 />}
      >
        {t('common:share-link')}
      </Button>
      <Modal
        id="modal-share"
        contentLabel={t('common:share-link')}
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="modal"
        overlayClassName="overlay"
        title={t('common:share-link')}
      >
        <div className="flex flex-wrap items-center justify-center">
          <CopyToClipboard text={content}>
            <RoundedButton
              id="copy-to-clipboard"
              Icon={FiCopy}
              iconBgColor="bg-gray-500"
              label={t('common:copy')}
              onClick={showToast}
            />
          </CopyToClipboard>
          <RoundedButton
            id="share-whatsapp"
            Icon={FaWhatsapp}
            iconBgColor="bg-whatsapp"
            label={t('common:whatsapp-share')}
            onClick={shareOnWhatsApp}
          />
          <RoundedButton
            id="share-telegram"
            Icon={FaTelegramPlane}
            iconBgColor="bg-telegram"
            label={t('common:telegram-share')}
            onClick={shareOnTelegram}
          />
        </div>
      </Modal>
    </Fragment>
  )
}
