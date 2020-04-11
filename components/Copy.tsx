import useTranslation from 'next-translate/useTranslation'
import React, { SyntheticEvent, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaWhatsapp, FaTelegram } from 'react-icons/fa'
import { FiCopy } from 'react-icons/fi'
import Modal from 'react-modal'
import Button from './Button'
import Box from './Box'
import Toast from './Toast'

interface ShareButtonProps {
  Icon: Function
  iconColor: string
  label: string
  onClick?: (e: SyntheticEvent) => void
}

const ShareButton = ({ Icon, iconColor, label, onClick }: ShareButtonProps) => (
  <button className="text-center m-2 mx-4 outline-none" onClick={onClick}>
    <Icon className="m-auto text-3xl" style={{ color: iconColor }} />
    <p>{label}</p>
  </button>
)
interface Props {
  content: string
}

Modal.setAppElement('#__next')

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
      <Button className="mb-4" onClick={() => setShowModal(true)}>
        <FiCopy />
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
      >
        <Box>
          <div className="text-center">
            <h2 className="mb-4 mr-4">{t('common:share-link')}:</h2>
            <div className="flex justify-evenly flex-wrap">
              <CopyToClipboard text={content}>
                <ShareButton
                  Icon={FiCopy}
                  iconColor="gray"
                  label={t('common:copy')}
                  onClick={() => {
                    shareAndClose()
                    setShowToast(true)
                  }}
                />
              </CopyToClipboard>
              <ShareButton
                Icon={FaWhatsapp}
                iconColor="#25d366"
                label={t('common:whatsapp-share')}
                onClick={() => shareAndClose(shareOnWhatsApp)}
              />
              <ShareButton
                Icon={FaTelegram}
                iconColor="#0088cc"
                label={t('common:telegram-share')}
                onClick={() => shareAndClose(shareOnTelegram)}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
