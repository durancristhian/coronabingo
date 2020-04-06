import useTranslation from 'next-translate/useTranslation'
import { Fragment } from 'react'
import { BOARD_NUMBER_COLOR } from '~/utils/constants'
import Ball from './Ball'

interface IProps {
  selectedNumbers: number[]
}

export default function LastNumbers({ selectedNumbers }: IProps) {
  const { t } = useTranslation()
  const [last, ...rest] = selectedNumbers

  return (
    <Fragment>
      {!!last && (
        <Fragment>
          <div className="flex items-center overflow-hidden">
            <div style={{ flex: '0 0 85px' }}>
              <Ball
                animate
                color={BOARD_NUMBER_COLOR[last - 1]}
                number={last}
                size={75}
              />
            </div>
            <div className="flex flex-auto overflow-x-scroll">
              {rest.map(n => (
                <div
                  className="opacity-50"
                  key={n}
                  style={{ flex: '0 0 65px' }}
                >
                  <Ball
                    color={BOARD_NUMBER_COLOR[n - 1]}
                    number={n}
                    size={55}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="flex-auto font-medium">{t(`jugar:dreams.${last}`)}</p>
            <p className="text-right w-24">
              <a
                href="https://es.wikipedia.org/wiki/Quiniela_(Argentina)"
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none focus:shadow-outline font-medium text-blue-600 text-xs md:text-sm underline"
              >
                {t('jugar:dreams-link')}
              </a>
            </p>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
