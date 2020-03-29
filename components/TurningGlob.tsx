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
  const rest = roomNumbers.slice(0, 4)

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
      {!!rest.length && (
        <div className="flex items-center justify-center">
          {rest.map((n, i) => (
            <div key={n} className={i === 0 ? 'w-1/3' : 'w-1/5'}>
              <Ball
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
