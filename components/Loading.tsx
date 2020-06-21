import useTranslation from 'next-translate/useTranslation'
import React from 'react'

export default function Loading() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="spinner"></div>
      <p className="mt-4">{t('common:loading')}</p>
    </div>
  )
}
