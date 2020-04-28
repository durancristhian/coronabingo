import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FaPaypal } from 'react-icons/fa'
import Anchor from '~/components/Anchor'
import Container from '~/components/Container'
import Emoji from '~/components/Emoji'
import Modal from '~/components/Modal'
import ShareButton from '~/components/ShareButton'

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
        <Container size="large">
          <div className="flex h-12 items-center justify-between">
            <p>
              <span>{t('common:made-by')}</span>
              <Anchor href="https://twitter.com/DuranCristhian">
                Cristhian Duran
              </Anchor>
            </p>
            <button
              id="donate"
              className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
              onClick={() => {
                setShowModal(true)
              }}
            >
              <span className="flex items-center">
                <span className="mr-1">{t('common:donate')}</span>
                <Emoji name="coffee" />
              </span>
            </button>
          </div>
        </Container>
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
          <div className="flex justify-center items-center mt-8">
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
