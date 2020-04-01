import { Fragment } from 'react'
import { BOARD_NUMBER_COLOR, DREAMS } from '~/utils/constants'
import Ball from './Ball'

interface IProps {
  selectedNumbers: number[]
}

export default function TurningGlob({ selectedNumbers }: IProps) {
  const [last, ...rest] = selectedNumbers

  return (
    <Fragment>
      {!!rest.length && (
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
              {rest.map((n, i) => (
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
          <p className="font-medium mt-4">{DREAMS[last]}</p>
        </Fragment>
      )}
    </Fragment>
  )
}
