import { useRouter } from 'next/router'
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
    <div>
      <p className="mb-1">Patonera</p>
      <div className="flex justify-center flex-wrap">
        {Object.keys(sounds).map(sound => (
          <div key={sound} className="mb-4 mr-4">
            <Button
              onClick={() => onClick(sound)}
              /* 
              // @ts-ignore */
              color="yellow"
            >
              <FiPlayCircle className="mr-4 text-2xl" />
              <span>{sounds[sound]}</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

const sounds: { [key: string]: string } = {
  carton: 'Cartón',
  coronabingo: 'Coronabingo',
  'cruzar-dedos': 'Cruzar los dedos',
  'ese-bolillero-papa': 'Ese bolillero papá',
  linea: 'Línea',
  'hundiste-mi-acorazado': 'Hundiste mi acorazado'
}
