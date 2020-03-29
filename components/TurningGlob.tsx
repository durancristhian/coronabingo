import { Fragment } from 'react'
import { BOARD_NUMBERS, DREAMS } from '~/utils/constants'
import Ball from './Ball'
import Button from './Button'
const knuthShuffle = require('knuth-shuffle').knuthShuffle
import { BOARD_NUMBER_COLOR } from '~/utils/constants'

interface IProps {
  isAdmin: boolean
  onNewNumber: (n: number) => void
  selectedNumbers: number[]
  turningGlob: boolean
}

export default function TurningGlob({
  isAdmin,
  onNewNumber,
  selectedNumbers,
  turningGlob
}: IProps) {
  const roomNumbers = [...selectedNumbers]
  const current = roomNumbers[0]

  const onNextButtonClick = () => {
    const missingNumbers = BOARD_NUMBERS.filter(n => !roomNumbers.includes(n))
    const shuffled = knuthShuffle(missingNumbers.slice(0))

    onNewNumber(shuffled[0])
  }

  return (
    <Fragment>
      {isAdmin && turningGlob && (
        <Button
          id="next"
          className="mb-4 w-full"
          onClick={onNextButtonClick}
          disabled={roomNumbers.length === 90}
        >
          Próximo número
        </Button>
      )}
      {!!roomNumbers.length && (
        <div className="flex items-center overflow-hidden">
          {roomNumbers.map((n, i) => (
            <div
              key={n}
              style={{
                flex: `0 0 ${i === 0 ? '85px' : '65px'}`
              }}
            >
              <Ball
                animate={i === 0}
                color={i === 0 ? BOARD_NUMBER_COLOR[n - 1] : 'bg-gray-500'}
                meaning={i === 0 ? DREAMS[current] : ''}
                number={n}
                size={i === 0 ? 75 : 55}
              />
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}
