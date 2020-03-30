import classnames from 'classnames'
import { Fragment } from 'react'
import { BOARD_NUMBER_COLOR, DREAMS } from '~/utils/constants'
import Ball from './Ball'

interface IProps {
  selectedNumbers: number[]
}

export default function TurningGlob({ selectedNumbers }: IProps) {
  const roomNumbers = [...selectedNumbers]
  const current = roomNumbers[0]

  return (
    <Fragment>
      {!!roomNumbers.length && (
        <Fragment>
          <div className="flex items-center overflow-hidden">
            {roomNumbers.map((n, i) => (
              <div
                className={classnames(i !== 0 && 'opacity-50')}
                key={n}
                style={{
                  flex: `0 0 ${i === 0 ? '85px' : '65px'}`
                }}
              >
                <Ball
                  animate={i === 0}
                  color={BOARD_NUMBER_COLOR[n - 1]}
                  number={n}
                  size={i === 0 ? 75 : 55}
                />
              </div>
            ))}
          </div>
          <p className="font-medium mt-4">{DREAMS[current]}</p>
        </Fragment>
      )}
    </Fragment>
  )
}
