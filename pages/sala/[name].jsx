import classnames from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiLink2 } from 'react-icons/fi'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Button from '../../components/Button'
import InputText from '../../components/InputText'
import db from '../../firebase'

export default function Sala() {
  const router = useRouter()
  const { name } = router.query
  const [room, setRoom] = useState({})

  useDeepCompareEffect(() => {
    if (!name) return

    /* TODO: Memory leak here */
    db.collection('rooms')
      .doc(name)
      .onSnapshot(doc => {
        setRoom(doc.data())
      })
  }, [name, room])

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
          <div className="mb-8">
            <h2 className="font-medium text-center text-xl">
              Información de la sala
            </h2>
          </div>
          <InputText
            id="room-name"
            label="Nombre"
            value={name || ''}
            readonly
            onFocus={event => event.target.select()}
          />
          <InputText
            id="videocall"
            label="URL de la videollamada"
            readonly
            onFocus={event => event.target.select()}
            value={room.videocall || ''}
          />
          {room.players && !!room.players.length && (
            <div className="mt-8">
              <div className="flex justify-between">
                <h3 className="font-medium text-md uppercase">Jugadores</h3>
                <span className={classnames(['font-medium'])}>
                  {room.players.length}/{MAX_PLAYERS}
                </span>
              </div>
              <div className="border-gray-300 border-t-2 mt-4 -mx-4">
                {room.players.map((player, index) => (
                  <div
                    key={index}
                    className={classnames([
                      'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                    ])}
                  >
                    <div className="flex-auto">
                      <p>{player.name}</p>
                    </div>
                    <div className="ml-4">
                      {/* TODO: This onClick is one of the most awful things I've ever seen */}
                      <Button
                        onClick={() => {
                          router.push(
                            `/sala/${name}/jugar?cartones=${player.boards}`
                          )
                        }}
                        disabled={!room.readyToPlay}
                      >
                        <FiLink2 />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MAX_PLAYERS = 30
