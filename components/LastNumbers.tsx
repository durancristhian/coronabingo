import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import Anchor from '~/components/Anchor'
import Ball from '~/components/Ball'
import Emoji from '~/components/Emoji'
import { DREAMS_EMOJIS } from '~/utils'

interface Props {
  selectedNumbers: number[]
}

export default function LastNumbers({ selectedNumbers }: Props) {
  const { t } = useTranslation()
  const [last, ...rest] = selectedNumbers
  const emoji = DREAMS_EMOJIS[last - 1]

  if (!selectedNumbers.length) {
    return (
      <p className="text-center text-gray-600">{t('playerId:no-numbers')}</p>
    )
  }

  return (
    <Fragment>
      <div className="flex items-center overflow-hidden">
        <div style={{ flex: '0 0 85px' }}>
          <Ball animate bgColor="bg-yellow-500" number={last} size={75} />
        </div>
        <div className="flex flex-auto overflow-x-scroll">
          {rest.map(n => (
            <div className="opacity-75" key={n} style={{ flex: '0 0 65px' }}>
              <Ball bgColor="bg-gray-400" number={n} size={55} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="flex flex-auto font-medium items-center">
          <span className="mr-1">{t(`playerId:dreams.${last}`)}</span>
          <span className="text-xs">
            <Emoji name={emoji} />
          </span>
        </p>
        <p className="text-right md:text-sm w-24">
          <Anchor
            href="https://es.wikipedia.org/wiki/Quiniela_(Argentina)"
            id="quiniela"
          >
            {t('playerId:dreams-link')}
          </Anchor>
        </p>
      </div>
    </Fragment>
  )
}
