import classnames from 'classnames'
import { BOARD_NUMBERS } from '~/utils/constants'

interface IProps {
  enableForAdmin: boolean
  onNewNumber: (n: number) => void
  selectedNumbers: number[]
}

export default function SelectedNumbers({
  enableForAdmin,
  onNewNumber,
  selectedNumbers
}: IProps) {
  return (
    <div className="bg-white mt-8 px-4 py-8 rounded shadow">
      <h2 className="font-medium mb-8 text-center text-xl">
        Numeros que ya salieron
      </h2>
      <div className="flex flex-wrap">
        {BOARD_NUMBERS.map((n, i) => (
          <button
            type="button"
            key={n}
            className={classnames([
              'cursor-default flex items-center justify-center h-8 sm:h-20',
              'focus:outline-none',
              'duration-150 ease-in-out transition',
              i >= 10 ? 'mt-2' : null,
              selectedNumbers.includes(n) && 'bg-green-400 text-green-800',
              enableForAdmin && 'cursor-pointer focus:shadow-outline'
            ])}
            style={{ width: '10%' }}
            onClick={() => enableForAdmin && onNewNumber(n)}
          >
            <span className="font-medium font-oswald text-sm sm:text-3xl uppercase">
              {n}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
