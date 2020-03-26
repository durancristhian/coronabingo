import { Fragment } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { BOARD_NUMBERS } from '~/utils/constants'
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
      <div className="bg-green-400 border-2 border-green-600 flex h-16 items-center justify-center p-4 rounded">
        <span className="font-medium font-oswald text-3xl text-green-800">
          {current || '-'}
        </span>
      </div>
      {isAdmin && turningGlob && (
        <Button
          id="next"
          className="mt-4 w-full"
          onClick={onNextButtonClick}
          disabled={roomNumbers.length === 90}
        >
          <span className="mr-2">Sacar otro número</span>
          <FiChevronRight className="text-lg" />
        </Button>
      )}
      {!!rest.length && (
        <div className="flex items-center mt-4">
          {rest.map(n => (
            <div
              key={n}
              className="border-2 border-gray-900 flex font-medium h-10 items-center"
              style={{
                marginRight: '2%',
                width: '18%'
              }}
            >
              <span className=" font-oswald text-center w-full">{n}</span>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}
