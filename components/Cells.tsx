import classnames from 'classnames'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { roomsRef } from '~/utils/firebase'
import EmptyCell from './EmptyCell'

interface IProps {
  boardId: number
  boardNumbers: number[]
  selectedNumbers: number[]
}

export default function Cells({
  boardId,
  boardNumbers,
  selectedNumbers
}: IProps) {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const playerId = router.query.jugador?.toString()
  const [numbers, setSelectedNumbers] = useState(selectedNumbers)

  useEffect(() => {
    const updatePlayer = async () => {
      roomsRef
        .doc(roomName)
        .collection('players')
        .doc(playerId)
        .update({
          [boardId]: numbers
        })
    }

    updatePlayer()
  }, [numbers])

  const toggleNumber = (n: number) => {
    setSelectedNumbers(
      numbers.includes(n)
        ? numbers.filter(number => number !== n)
        : [...numbers, n]
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
              'bg-white border-b-2 border-r-2 border-gray-900 cursor-pointer flex h-8 sm:h-20 items-center justify-center p-1 relative w-1/10',
              numbers.includes(boardNumber) && 'bg-orange-400'
            ])}
            onClick={() => handleClick(boardNumber)}
          >
            <div
              className={classnames(
                ['absolute bottom-0 left-0 m-1 sm:m-2 right-0 top-0 z-0'],
                numbers.includes(boardNumber) && 'poroto'
              )}
              style={{
                transform: `rotate(${boardNumber + i}deg)`
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
