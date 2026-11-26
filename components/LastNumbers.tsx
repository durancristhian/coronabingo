import useTranslation from 'next-translate/useTranslation'
import React, { Fragment } from 'react'
import Anchor from '~/components/Anchor'
import Ball from '~/components/Ball'

interface Props {
  hideNumbersMeaning: boolean
  selectedNumbers: number[]
}

export default function LastNumbers({
  hideNumbersMeaning,
  selectedNumbers,
}: Props) {
  const { t } = useTranslation()
  const [last] = selectedNumbers

  if (!selectedNumbers.length) {
    return (
      <p className="text-center text-gray-600">{t('playerId:no-numbers')}</p>
    )
  }

  return (
    <Fragment>
      <div className="cb-last-numbers flex items-center">
        <div className="flex overflow-x-scroll overflow-y-hidden w-full">
          {selectedNumbers.map((n, i) => (
            <Ball key={n} number={n} index={i} />
          ))}
        </div>
      </div>
      {!hideNumbersMeaning && (
        <div
          id="number-meaning"
          className="cb-number-meaning flex items-center justify-between mt-4"
        >
          <p
            className="appear-after flex flex-auto font-medium items-center"
            key={last}
          >
            <span className="cb-dream-illustration">
              <img src={`/dreams/${last}.svg`} alt="" width={48} height={48} />
            </span>
            <span>{t(`playerId:dreams.${last}`)}</span>
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
      )}
    </Fragment>
  )
}
