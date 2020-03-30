import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSound from 'use-sound'
import useRoom from '~/hooks/useRoom'
// @ts-ignore
import carton from '~/public/sounds/carton.mp3'
// @ts-ignore
import coronabingo from '~/public/sounds/coronabingo.mp3'
// @ts-ignore
import cruzarDedos from '~/public/sounds/cruzar-dedos.mp3'
// @ts-ignore
import eseBolilleroPapa from '~/public/sounds/ese-bolillero-papa.mp3'
// @ts-ignore
import linea from '~/public/sounds/linea.mp3'

export default function Sounds() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const room = useRoom(roomName)
  const [playCarton, { stop: stopCarton }] = useSound(carton)
  const [playCoronabingo, { stop: stopCoronabingo }] = useSound(coronabingo)
  const [playCruzarDedos, { stop: stopCruzarDedos }] = useSound(cruzarDedos)
  const [playEseBolilleroPapa, { stop: stopEseBolilleroPapa }] = useSound(
    eseBolilleroPapa
  )
  const [playLinea, { stop: stopLinea }] = useSound(linea)

  useEffect(() => {
    if (!room) return

    const { carton, coronabingo, cruzarDedos, eseBolilleroPapa, linea } = room

    if (carton) {
      stopCarton()
      playCarton({})
    }

    if (coronabingo) {
      stopCoronabingo()
      playCoronabingo({})
    }

    if (cruzarDedos) {
      stopCruzarDedos()
      playCruzarDedos({})
    }

    if (eseBolilleroPapa) {
      stopEseBolilleroPapa()
      playEseBolilleroPapa({})
    }

    if (linea) {
      stopLinea()
      playLinea({})
    }
  }, [room])

  return null
}
