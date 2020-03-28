import classnames from 'classnames'
import { Fragment } from 'react'
const poroto = require('~/public/poroto.png')

interface IProps {
  boardNumbers: number[]
  selectedNumbers: number[]
  setSelectedNumbers: (ns: number[]) => void
}

export default function Cells({
  boardNumbers,
  selectedNumbers = [],
  setSelectedNumbers
}: IProps) {
  const toggleNumber = (n: number) => {
    setSelectedNumbers(
      selectedNumbers.includes(n)
        ? selectedNumbers.filter(number => number !== n)
        : [...selectedNumbers, n]
    )
  }

  const handleClick = (number: number) => {
    if (number) {
      toggleNumber(number)
    }
  }

  return (
    <Fragment>
      {boardNumbers.map((boardNumber, i) => (
        <div
          key={i}
          className={classnames([
            'border-b-2 border-r-2 border-gray-900 flex h-8 sm:h-20 items-center justify-center p-1 relative',
            boardNumber ? 'bg-white cursor-pointer' : 'bg-yellow-200',
            selectedNumbers.includes(boardNumber) ? 'bg-orange-400' : null
          ])}
          onClick={() => {
            handleClick(boardNumber)
          }}
          style={{ width: 'calc(100% / 9)' }}
        >
          <div
            className={classnames(
              ['absolute bottom-0 left-0 m-1 sm:m-2 right-0 top-0 z-0'],
              selectedNumbers.includes(boardNumber) ? 'poroto' : null
            )}
            style={{
              ...(selectedNumbers.includes(boardNumber) && {
                backgroundImage: `url(${poroto || ''})`
              }),
              transform: `rotate(${boardNumber + i}deg)`
            }}
          ></div>
          <span className="font-medium font-oswald relative text-lg sm:text-5xl text-shadow-white z-10">
            {boardNumber || ''}
          </span>
        </div>
      ))}
    </Fragment>
  )
}
