import classnames from 'classnames'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import { SOUNDS } from '~/utils/constants'
import { roomsRef } from '~/utils/firebase'
import Button from './Button'

export default function Pato() {
  const router = useRouter()
  const roomName = router.query.name?.toString()

  const onClick = async (sound: string) => {
    await roomsRef.doc(roomName).update({
      soundToPlay: sound
    })
  }

  return (
    <Fragment>
      <h2 className="font-medium mb-8 text-center text-xl">Botonera</h2>
      <div className="border-gray-300 border-l-2 border-r-2 border-t-2 rounded">
        {SOUNDS.map(({ name, url }, index) => (
          <div
            key={index}
            className={classnames([
              'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
              index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
            ])}
          >
            <div className="mr-4">
              <Button onClick={() => onClick(url)}>
                <FiPlayCircle />
              </Button>
            </div>
            <div className="flex flex-auto items-center">
              <p className="leading-normal">{name}</p>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  )
}
