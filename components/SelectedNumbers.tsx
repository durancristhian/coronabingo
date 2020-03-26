import { Fragment } from 'react'
import classnames from 'classnames'
import { BOARD_NUMBERS } from '~/utils/constants'

interface IProps {
  isAdmin: boolean
  onNewNumber: (n: number) => void
  selectedNumbers: number[]
  turningGlob: boolean
}

export default function SelectedNumbers({
  isAdmin,
  onNewNumber,
  selectedNumbers,
  turningGlob
}: IProps) {
  const enableForAdmin = isAdmin && !turningGlob

  return (
    <Fragment>
      {isAdmin && !turningGlob && (
        <div className="italic leading-normal mb-4 text-gray-600 text-sm">
          <p>
            Marcá en la lista de abajo los números que van saliendo en tu
            bolillero.
          </p>
        </div>
      )}
      <div className="flex flex-wrap">
        {BOARD_NUMBERS.map((n, i) => (
          <button
            type="button"
            key={n}
            className={classnames([
              'cursor-default flex items-center justify-center h-10',
              'focus:outline-none',
              'duration-150 ease-in-out transition',
              i >= 10 ? 'mt-2' : null,
              selectedNumbers.includes(n) && 'bg-green-400 text-green-800',
              enableForAdmin && 'cursor-pointer focus:shadow-outline'
            ])}
            style={{ width: '10%' }}
            onClick={() => enableForAdmin && onNewNumber(n)}
          >
            <span className="font-medium font-oswald uppercase">{n}</span>
          </button>
        ))}
      </div>
    </Fragment>
  )
}
