import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
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
      <p className="mb-1">Patonera</p>
      <div className="flex justify-center flex-wrap">
        {Object.keys(sounds).map(sound => (
          <div key={sound} className="mb-4 mr-4">
            <Button onClick={() => onClick(sound)} color="yellow">
              <FiPlayCircle />
              <span className="ml-4">{sounds[sound]}</span>
            </Button>
          </div>
        ))}
      </div>
    </Fragment>
  )
}

interface ISound {
  [key: string]: string
}

const sounds: ISound = {
  carton: 'Cartón',
  coronabingo: 'Coronabingo',
  'cruzar-dedos': 'Cruzar los dedos',
  'ese-bolillero-papa': 'Ese bolillero papá',
  'hundiste-mi-acorazado': 'Hundiste mi acorazado',
  linea: 'Línea'
}
