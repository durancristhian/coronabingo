import useTranslation from 'next-translate/useTranslation'
import React from 'react'

interface Props {
  message?: string
}

export default function Loading({ message }: Props) {
  const { t } = useTranslation()
  const msg = message || t('common:loading')

  return (
    <div className="cb-loading flex flex-col items-center justify-center text-center">
      <div className="cb-spinner spinner"></div>
      <p className="mt-4">{msg}</p>
    </div>
  )
}
