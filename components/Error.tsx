import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { FiRefreshCw } from 'react-icons/fi'
import Button from './Button'

interface Props {
  message?: string
}

export default function Error({ message }: Props) {
  const { t } = useTranslation()
  const msg = message || t('common:reload')

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="mb-4">{t('common:error')}</p>
      <Button
        id="reload"
        aria-label=""
        iconLeft={<FiRefreshCw />}
        onClick={() => {
          window.location.reload()
        }}
      >
        {msg}
      </Button>
    </div>
  )
}
