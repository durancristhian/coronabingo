import classnames from 'classnames'
import { BOARD_NUMBERS } from '~/utils/constants'

interface IProps {
  selectedNumbers: number[]
}

export default function SelectedNumbers({ selectedNumbers }: IProps) {
  return (
    <div className="bg-white mt-8 px-4 py-8 rounded shadow">
      <div className="mb-8">
        <h2 className="font-medium text-center text-xl">Bolillero</h2>
      </div>
      <div className="flex flex-wrap">
        {BOARD_NUMBERS.map((n, i) => (
          <div
            key={n}
            className={classnames([
              'flex items-center justify-center h-8 sm:h-20',
              i >= 10 ? 'pt-2' : null,
              selectedNumbers.includes(n) ? `bg-green-400 text-green-800` : null
            ])}
            style={{ width: '10%' }}
          >
            <span className="font-medium text-sm sm:text-xl uppercase">
              {n}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
