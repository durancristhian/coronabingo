import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import Button from './Button'
import { ConfettiType } from './Confetti'
import Heading from './Heading'

interface Props {
  confettiType: ConfettiType | ''
  onConfettiChange: (confettiType: ConfettiType | '') => void
}

export default function Celebrations({
  confettiType,
  onConfettiChange,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="my-8">
      <Heading type="h2">
        <span className="uppercase">{t('jugar:celebrations')}</span>
      </Heading>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="mb-4 md:mb-0 mr-4">
          <Button
            color={confettiType === 'confetti' ? 'red' : 'green'}
            onClick={() =>
              onConfettiChange(confettiType === 'confetti' ? '' : 'confetti')
            }
          >
            {confettiType === 'confetti' ? (
              <Fragment>
                <FiFrown />
                <span className="ml-4">{t('jugar:hide-confetti')}</span>
              </Fragment>
            ) : (
              <Fragment>
                <FiSmile />
                <span className="ml-4">{t('jugar:show-confetti')}</span>
              </Fragment>
            )}
          </Button>
        </div>
        <div className="mr-4 md:mr-0">
          <Button
            color={confettiType === 'pallbearers' ? 'red' : 'green'}
            onClick={() =>
              onConfettiChange(
                confettiType === 'pallbearers' ? '' : 'pallbearers',
              )
            }
          >
            {confettiType === 'pallbearers' ? (
              <Fragment>
                <FiFrown />
                <span className="ml-4">{t('jugar:hide-pallbearers')}</span>
              </Fragment>
            ) : (
              <Fragment>
                <FiSmile />
                <span className="ml-4">{t('jugar:show-pallbearers')}</span>
              </Fragment>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
