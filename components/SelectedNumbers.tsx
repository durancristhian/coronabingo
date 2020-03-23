import classnames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { BOARD_NUMBERS } from '~/utils/constants'
import { roomsRef } from '~/utils/firebase'

interface IProps {
  isAdmin: boolean
  selectedNumbers: number[]
}

export default function SelectedNumbers({ isAdmin, selectedNumbers }: IProps) {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const [numbers, setNumbers] = useState<number[]>(selectedNumbers)

  useDeepCompareEffect(() => {
    const updateRoom = async () => {
      const roomRef = roomsRef.doc(roomName)
      roomRef.update({ selectedNumbers: numbers })
    }

    updateRoom()
  }, [roomName, numbers])

  const onFieldChange = (n: number) => {
    if (!isAdmin) return

    setNumbers(
      numbers.includes(n)
        ? numbers.filter(number => number !== n)
        : [...numbers, n]
    )
  }

  return (
    <div className="bg-white mt-8 px-4 py-8 rounded shadow">
      <div className="mb-8">
        <h2 className="font-medium text-center text-xl">Bolillero</h2>
      </div>
      <div className="flex flex-wrap">
        {BOARD_NUMBERS.map((n, i) => (
          <div
            key={n}
            className={classnames(['text-center', i >= 10 ? 'pt-2' : null])}
            style={{ width: '10%' }}
          >
            <button
              className={classnames([
                `font-medium h-8 sm:h-20 text-center text-sm sm:text-xl uppercase w-full`,
                `focus:outline-none focus:shadow-outline`,
                'duration-150 ease-in-out transition',
                selectedNumbers.includes(n)
                  ? `bg-green-400 focus:bg-green-500 focus:text-green-900 text-green-800`
                  : null
              ])}
              onClick={() => onFieldChange(n)}
            >
              {n}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
