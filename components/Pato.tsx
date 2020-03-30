import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import { roomsRef } from '~/utils/firebase'
import Button from './Button'

export default function Pato() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  /* TODO: This should be initialized from Firebase */
  const [status, setStatus] = useState(
    sounds.reduce((prev, curr) => ({ ...prev, [curr]: false }), {})
  )

  const onClick = async (key: string) => {
    await roomsRef.doc(roomName).update({
      // @ts-ignore
      [key]: !status[key]
    })

    setStatus(status => ({
      ...status,
      // @ts-ignore
      [key]: !status[key]
    }))
  }

  return (
    <div>
      <p className="mb-1">Patonera</p>
      <div className="flex justify-center flex-wrap">
        {sounds.map(sound => (
          <div key={sound} className="mb-4 mr-4">
            <Button
              onClick={() => onClick(sound)}
              /* 
              // @ts-ignore */
              color={status[sound] ? 'red' : 'yellow'}
            >
              <FiPlayCircle className="mr-4 text-2xl" />
              <span>{soundNames[sound]}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

const sounds = [
  'carton',
  'coronabingo',
  'cruzarDedos',
  'eseBolilleroPapa',
  'linea'
]
const soundNames: { [key: string]: string } = {
  carton: 'Cartón',
  coronabingo: 'Coronabingo',
  cruzarDedos: 'Cruzar los dedos',
  eseBolilleroPapa: 'Ese bolillero papá',
  linea: 'Línea'
}
