import { Fragment } from 'react'
import { BOARD_NUMBERS, DREAMS } from '~/utils/constants'
import Ball from './Ball'
import Button from './Button'
const knuthShuffle = require('knuth-shuffle').knuthShuffle

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
  const rest = roomNumbers.slice(1, 6)

  const onNextButtonClick = () => {
    const missingNumbers = BOARD_NUMBERS.filter(n => !roomNumbers.includes(n))
    const shuffled = knuthShuffle(missingNumbers.slice(0))

    onNewNumber(shuffled[0])
  }

  return (
    <Fragment>
      {current && <Ball meaning={DREAMS[current]}>{current}</Ball>}
      {isAdmin && turningGlob && (
        <Button
          id="next"
          className="mt-4 w-full"
          onClick={onNextButtonClick}
          disabled={roomNumbers.length === 90}
        >
          Próximo número
        </Button>
      )}
      {!!rest.length && (
        <div className="flex mt-4">
          {rest.map(n => (
            <div className="w-1/5">
              <Ball size={50}>{n}</Ball>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}
