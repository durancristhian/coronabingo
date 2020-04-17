import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { FiFrown, FiSmile } from 'react-icons/fi'
import { ConfettiType } from '~/interfaces'
import Button from './Button'
import { confettiTypes } from './Confetti'
import Heading from './Heading'

interface Props {
  confettiType: ConfettiType
  onConfettiChange: (confettiType: ConfettiType) => void
}

export default function Celebrations({
  confettiType,
  onConfettiChange,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="my-8">
      <Heading type="h2">{t('jugar:celebrations')}</Heading>
      <div className="flex flex-col md:flex-row items-center justify-center">
        {confettiTypes.map((ct, i) => (
          <div
            key={ct}
            className={classnames([i !== 0 && 'mt-4 md:mt-0 md:ml-4'])}
          >
            <Button
              id={`click-${ct}`}
              color={ct === confettiType ? 'red' : 'green'}
              onClick={() =>
                onConfettiChange(
                  confettiType === ct ? '' : (ct as ConfettiType),
                )
              }
            >
              {ct === confettiType ? (
                <Fragment>
                  <FiFrown />
                  <span className="ml-4">{t(`jugar:hide-${ct}`)}</span>
                </Fragment>
              ) : (
                <Fragment>
                  <FiSmile />
                  <span className="ml-4">{t(`jugar:show-${ct}`)}</span>
                </Fragment>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
