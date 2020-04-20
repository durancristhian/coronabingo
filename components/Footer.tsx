import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FaPaypal } from 'react-icons/fa'
import { FiHeart } from 'react-icons/fi'
import Anchor from './Anchor'
import Button from './Button'
import Container from './Container'
import Modal from './Modal'
import ShareButton from './ShareButton'

export default function Footer() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const donateMercadoPago = () => {
    window.open(
      'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=82474655-1d35f08f-7cf8-4a0a-9b8e-100b6e87ceab',
    )
  }

  const donatePaypal = () => {
    window.open('https://www.paypal.me/coronabingo')
  }

  return (
    <Fragment>
      <footer className="bg-white px-4 py-2 shadow">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              id="donate"
              color="pink"
              onClick={() => {
                setShowModal(true)
              }}
            >
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
      <Modal
        className="modal"
        contentLabel={t('common:donate')}
        id="modal-donate"
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false)
        }}
        overlayClassName="overlay"
        title={t('common:donate')}
      >
        <Container size="large">
          <p>{t('common:donate-copy')}</p>
          <div className="flex justify-center items-center mt-4">
            <ShareButton
              imageURL="/mercado-pago.png"
              imageAlt="Mercado Pago"
              iconBgColor="bg-mercado-pago"
              label={t('common:donate-mercado-pago')}
              onClick={donateMercadoPago}
            />
            <ShareButton
              Icon={FaPaypal}
              iconBgColor="bg-paypal"
              label={t('common:donate-paypal')}
              onClick={donatePaypal}
            />
          </div>
        </Container>
      </Modal>
    </Fragment>
  )
}
