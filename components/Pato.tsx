import { useRouter } from 'next/router'
import { FiPlayCircle } from 'react-icons/fi'
import { roomsRef } from '~/utils/firebase'
import Button from './Button'

export default function Pato() {
  const router = useRouter()
  const roomName = router.query.name?.toString()

  const onClick = async (fileName: string) => {
    await roomsRef.doc(roomName).update({
      soundToPlay: fileName
    })
  }

  return (
    <div>
      <p className="mb-1">Patonera</p>
      <Button onClick={() => onClick('mira-ese-bolillero-papa')}>
        <FiPlayCircle className="mr-4 text-2xl" />
        Mirá ese bolillero papá
      </Button>
    </div>
  )
}
