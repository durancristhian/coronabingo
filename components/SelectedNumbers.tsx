import { useRouter } from 'next/router'
import { useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { BOARD_NUMBERS } from '~/utils/constants'
import db from '~/utils/firebase'
import Button from './Button'

interface IProps {
  isAdmin: boolean
  selectedNumbers: number[]
}

export default function SelectedNumbers({ isAdmin, selectedNumbers }: IProps) {
  const router = useRouter()
  const name = router.query.name?.toString()
  const [numbers, setNumbers] = useState<number[]>(selectedNumbers)

  useDeepCompareEffect(() => {
    const updateRoom = async () => {
      const roomRef = db.collection('rooms').doc(name)
      roomRef.update({ selectedNumbers: numbers })
    }

    updateRoom()
  }, [name, numbers])

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
        {BOARD_NUMBERS.map(n => (
          <div key={n} className="p-2 text-center" style={{ width: '10%' }}>
            <Button
              className="h-10 md:h-16 rounded-full w-10 md:w-16"
              id={`number-${n}`}
              onButtonClick={() => onFieldChange(n)}
              color={selectedNumbers.includes(n) ? 'green' : 'gray'}
            >
              {n}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
