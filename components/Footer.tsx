import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { FiHeart } from 'react-icons/fi'
import Anchor from './Anchor'
import Button from './Button'

export default function Footer() {
  const { t } = useTranslation()

  const donate = () => {
    window.open(
      'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=82474655-1d35f08f-7cf8-4a0a-9b8e-100b6e87ceab',
    )
  }

  return (
    <footer className="bg-white px-4 py-2 shadow">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button color="pink" onClick={donate}>
            <FiHeart />
            <span className="ml-4">{t('common:donate')}</span>
          </Button>
          <p>
            <span>{t('common:made-by')}</span>
            <Anchor href="https://twitter.com/DuranCristhian">
              Cristhian Duran
            </Anchor>
          </p>
        </div>
      </div>
    </footer>
  )
}
