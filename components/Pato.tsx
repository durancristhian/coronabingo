import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import { roomsRef } from '~/utils/firebase'
import Button from './Button'

export default function Pato() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const [playing, setPlaying] = useState(false)

  const onClick = async () => {
    await roomsRef.doc(roomName).update({
      miraEseBolilleroPapa: !playing
    })

    setPlaying(!playing)
  }

  return (
    <div>
      <p className="mb-1">Patonera</p>
      <Button onClick={onClick}>
        <FiPlayCircle className="mr-4 text-2xl" />
        Mirá ese bolillero papá
      </Button>
    </div>
  )
}
