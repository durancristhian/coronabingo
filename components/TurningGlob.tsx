import { FiChevronRight } from 'react-icons/fi'
import { BOARD_NUMBERS } from '~/utils/constants'
import Button from './Button'
const knuthShuffle = require('knuth-shuffle').knuthShuffle

interface IProps {
  isAdmin: boolean
  onNewNumber: (n: number) => void
  selectedNumbers: number[]
}

export default function TurningGlob({
  isAdmin,
  onNewNumber,
  selectedNumbers
}: IProps) {
  const roomNumbers = selectedNumbers
  const current = roomNumbers[0]
  const rest = roomNumbers.slice(1, 6)

  const onNextButtonClick = () => {
    const missingNumbers = BOARD_NUMBERS.filter(n => !roomNumbers.includes(n))
    const shuffled = knuthShuffle(missingNumbers.slice(0))

    onNewNumber(shuffled[0])
  }

  return (
    <div className="bg-white mt-8 px-4 py-8 rounded shadow">
      <h2 className="font-medium mb-8 text-center text-xl">Bolillero</h2>
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-full sm:w-1/3">
          <div className="bg-green-400 border-2 border-green-600 flex h-16 sm:h-24 items-center justify-center mb-4 px-2 py-4 rounded">
            <span className="font-medium font-oswald text-3xl sm:text-5xl text-green-800">
              {current}
            </span>
          </div>
          {isAdmin && (
            <Button
              id="next"
              className="w-full"
              onButtonClick={onNextButtonClick}
              disabled={roomNumbers.length === 90}
            >
              <span className="mr-4">Siguiente</span>
              <FiChevronRight className="text-lg" />
            </Button>
          )}
        </div>
        <div className="mt-8 sm:ml-8 w-full sm:w-2/3">
          <div className="flex items-center justify-between">
            {rest.map(n => (
              <div
                key={n}
                className="border-2 border-gray-900 flex font-medium h-8 sm:h-20 items-center text-xl sm:text-3xl w-1/6"
              >
                <span className=" font-oswald text-center w-full">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
