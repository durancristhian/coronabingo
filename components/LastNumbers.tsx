import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import { DREAMS_EMOJIS } from '~/utils/constants'
import Anchor from './Anchor'
import Ball from './Ball'

interface Props {
  selectedNumbers: number[]
}

export default function LastNumbers({ selectedNumbers }: Props) {
  const { t } = useTranslation()
  const [last, ...rest] = selectedNumbers
  const emoji = DREAMS_EMOJIS[last - 1]

  return (
    <Fragment>
      {!!last && (
        <Fragment>
          <div className="flex items-center overflow-hidden">
            <div style={{ flex: '0 0 85px' }}>
              <Ball animate color="yellow" number={last} size={75} />
            </div>
            <div className="flex flex-auto overflow-x-scroll">
              {rest.map(n => (
                <div
                  className="opacity-75"
                  key={n}
                  style={{ flex: '0 0 65px' }}
                >
                  <Ball color="gray" number={n} size={55} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="flex flex-auto font-medium items-center">
              <span className="mr-1">{t(`jugar:dreams.${last}`)}</span>
              <span className="text-xs">
                <i
                  className={classnames('em', emoji)}
                  tabIndex={-1}
                  aria-label={t(`jugar:dreams.${last}`)}
                ></i>
              </span>
            </p>
            <p className="text-right md:text-sm w-24">
              <Anchor href="https://es.wikipedia.org/wiki/Quiniela_(Argentina)">
                {t('jugar:dreams-link')}
              </Anchor>
            </p>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
