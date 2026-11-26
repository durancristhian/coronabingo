import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { TelegramIcon, WhatsAppIcon } from '~/components/BrandIcons'
import Button from '~/components/Button'
import Modal from '~/components/Modal'
import RoundedButton from '~/components/RoundedButton'
import { NodesIcon, SquaresStackedIcon } from '~/components/icons'
import useToast from '~/hooks/useToast'

interface Props {
  content: string
}

export default function Share({ content }: Props) {
  const [showModal, setShowModal] = useState(false)
  const { createToast } = useToast()
  const { t } = useTranslation()

  const shareOnWhatsApp = () => {
    setShowModal(false)

    window.open(`https://api.whatsapp.com/send?text=${content}`)
  }

  const shareOnTelegram = () => {
    setShowModal(false)

    window.open(`https://t.me/share/url?url=${content}`)
  }

  const showToast = () => {
    setShowModal(false)

    createToast('common:copied', 'information', 2000)
  }

  return (
    <Fragment>
      <Button
        aria-label={t('common:share-link')}
        id="open-share-modal"
        onClick={() => setShowModal(true)}
        iconLeft={<NodesIcon />}
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
              Icon={SquaresStackedIcon}
              iconBgColor="bg-gray-500"
              label={t('common:copy')}
              onClick={showToast}
            />
          </CopyToClipboard>
          <RoundedButton
            id="share-whatsapp"
            Icon={WhatsAppIcon}
            iconBgColor="bg-whatsapp"
            label={t('common:whatsapp-share')}
            onClick={shareOnWhatsApp}
          />
          <RoundedButton
            id="share-telegram"
            Icon={TelegramIcon}
            iconBgColor="bg-telegram"
            label={t('common:telegram-share')}
            onClick={shareOnTelegram}
          />
        </div>
      </Modal>
    </Fragment>
  )
}
