import classnames from 'classnames'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { roomsRef } from '~/utils/firebase'
const poroto = require('~/public/poroto.png')

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
      {boardNumbers.map((boardNumber, i) => (
        <div
          key={i}
          className={classnames([
            'border-b-2 border-r-2 border-gray-900 flex h-20 items-center justify-center p-1 relative',
            boardNumber ? 'bg-white cursor-pointer' : 'bg-yellow-200',
            numbers.includes(boardNumber) ? 'bg-orange-400' : null
          ])}
          onClick={() => {
            handleClick(boardNumber)
          }}
          style={{ width: 'calc(100% / 9)' }}
        >
          <div
            className={classnames(
              ['absolute bottom-0 left-0 m-2 right-0 top-0 z-0'],
              numbers.includes(boardNumber) ? 'poroto' : null
            )}
            style={{
              ...(numbers.includes(boardNumber) && {
                backgroundImage: `url(${poroto || ''})`
              }),
              transform: `rotate(${boardNumber + i}deg)`
            }}
          ></div>
          <span className="font-medium font-oswald relative text-2xl sm:text-5xl text-shadow-white z-10">
            {boardNumber || ''}
          </span>
        </div>
      ))}
    </Fragment>
  )
}
