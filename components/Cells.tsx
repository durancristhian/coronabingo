import classnames from 'classnames'
import React, { Fragment } from 'react'
import { BoardNumbers } from '~/hooks/useBoards'
import EmptyCell from './EmptyCell'

interface Props {
  boardNumbers: BoardNumbers
  selectedNumbers: number[]
  setSelectedNumbers: (ns: number[]) => void
}

export default function Cells({
  boardNumbers = [],
  selectedNumbers = [],
  setSelectedNumbers,
}: Props) {
  const toggleNumber = (n: number) => {
    setSelectedNumbers(
      selectedNumbers.includes(n)
        ? selectedNumbers.filter(number => number !== n)
        : [...selectedNumbers, n],
    )
  }

  const handleClick = (number: number) => {
    if (number) {
      toggleNumber(number)
    }
  }

  return (
    <Fragment>
      {boardNumbers.map((boardNumber, i) => {
        if (!boardNumber) return <EmptyCell key={i} />

        return (
          <div
            key={i}
            className={classnames([
              'bg-white border-b-2 border-r-2 border-gray-900 flex h-8 sm:h-20 items-center justify-center p-1 relative w-1/10',
              selectedNumbers.includes(boardNumber) && 'bg-orange-400',
            ])}
            onClick={() => handleClick(boardNumber)}
            onKeyPress={() => handleClick(boardNumber)}
            role="button"
            tabIndex={0}
          >
            <div
              className={classnames(
                ['absolute bottom-0 left-0 m-1 sm:m-2 right-0 top-0 z-0'],
                selectedNumbers.includes(boardNumber) && 'poroto',
              )}
              style={{
                transform: `rotate(${boardNumber + i}deg)`,
              }}
            ></div>
            <span className="font-medium font-oswald relative text-lg sm:text-5xl text-shadow-white z-10">
              {boardNumber}
            </span>
          </div>
        )
      })}
    </Fragment>
  )
}
