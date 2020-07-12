import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FaPaypal } from 'react-icons/fa'
import { FiCoffee, FiHeart, FiTwitter } from 'react-icons/fi'
import Anchor from '~/components/Anchor'
import Container from '~/components/Container'
import Modal from '~/components/Modal'
import News from '~/components/News'
import RoundedButton from '~/components/RoundedButton'

const TWEETS = [
  '1266490485650198528',
  '1267934678784389121',
  '1246110709005660163',
  '1279431298990379012',
]

export default function Footer() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const donateCafecito = () => {
    window.open('https://cafecito.app/durancristhian')
  }

  const donatePaypal = () => {
    window.open('https://www.paypal.me/coronabingo')
  }

  return (
    <Fragment>
      <footer className="bg-white p-4 shadow">
        <Container size="large">
          <News tweetIds={TWEETS} />
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-center md:text-left">
              <span>{t('common:made-by')}</span>
              <Anchor href="https://twitter.com/DuranCristhian" id="my-twitter">
                Cristhian Duran
              </Anchor>
            </p>
            <div className="mt-8 md:mt-0 text-center md:text-left">
              <ul className="md:flex md:items-center md:justify-center">
                <li className="mb-2 md:mb-0 md:mr-4">
                  <button
                    id="donate"
                    className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
                    onClick={() => {
                      setShowModal(true)
                    }}
                  >
                    <span className="flex items-center justify-center">
                      <FiCoffee />
                      <span className="ml-1">{t('common:donate')}</span>
                    </span>
                  </button>
                </li>
                <li className="mb-2 md:mb-0 md:mr-4">
                  <Anchor
                    href="https://forms.gle/egSBrsKSFnEgabff7"
                    id="feedback-form"
                    display="block"
                  >
                    <span className="flex items-center justify-center">
                      <FiHeart />
                      <span className="ml-1">{t('common:feedback-form')}</span>
                    </span>
                  </Anchor>
                </li>
                <li>
                  <Anchor
                    href="https://twitter.com/corona_bingo"
                    id="coronabingo-twitter"
                    display="block"
                  >
                    <span className="flex items-center justify-center">
                      <FiTwitter />
                      <span className="ml-1">
                        {t('common:coronabingo-twitter')}
                      </span>
                    </span>
                  </Anchor>
                </li>
              </ul>
            </div>
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
            <RoundedButton
              id="donate-cafecito"
              imageURL="/cafecito.png"
              imageAlt="Cafecito"
              iconBgColor="bg-cafecito"
              label={t('common:donate-cafecito')}
              onClick={donateCafecito}
            />
            <RoundedButton
              id="donate-paypal"
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
