import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FaWhatsapp } from 'react-icons/fa'
import { FiCopy } from 'react-icons/fi'
import Button from './Button'

interface Props {
  content: string
}

export default function Copy({ content }: Props) {
  const { t } = useTranslation()

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${content}`)
  }

  return (
    <div className="flex flex-wrap">
      <div className="mr-4">
        <CopyToClipboard text={content}>
          <Button>
            <FiCopy />
            <span className="ml-4">{t('common:copy')}</span>
          </Button>
        </CopyToClipboard>
      </div>
      <div className="mr-4">
        <Button onClick={shareOnWhatsApp}>
          <FaWhatsapp />
          <span className="ml-4">{t('common:whatsapp-share')}</span>
        </Button>
      </div>
    </div>
  )
}
