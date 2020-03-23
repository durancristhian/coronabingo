import classnames from 'classnames'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiLink2 } from 'react-icons/fi'
import Button from '~/components/Button'
import InputText from '~/components/InputText'
import { IPlayer } from '~/components/Players'
import { roomsRef } from '~/utils/firebase'

export default function Sala() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const [room, setRoom] = useState<firebase.firestore.DocumentData>({})
  const [players, setPlayers] = useState<IPlayer[]>([])

  useEffect(() => {
    if (!roomName) return

    const unsubscribe = roomsRef.doc(roomName).onSnapshot(snapshot => {
      const roomData = snapshot.data()

      if (roomData) {
        setRoom(roomData)
      }
    })

    return unsubscribe
  }, [roomName])

  useEffect(() => {
    if (!roomName) return

    const unsubscribe = roomsRef
      .doc(roomName)
      .collection('players')
      .onSnapshot(snapshot => {
        const players: IPlayer[] = []

        snapshot.docs.forEach(doc => {
          const playerData = doc.data()

          if (playerData) {
            // @ts-ignore
            players.push(playerData)
          }
        })

        setPlayers(players)
      })

    return unsubscribe
  }, [roomName])

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
          <div className="mb-8">
            <h2 className="font-medium text-center text-xl">
              Información de la sala
            </h2>
          </div>
          <InputText
            id="room-name"
            label="Nombre"
            value={roomName || ''}
            readonly
            onFocus={event => event.target.select()}
          />
          <InputText
            id="videocall"
            label="URL de la videollamada"
            readonly
            onFocus={event => event.target.select()}
            value={room.videoCall || ''}
          />
          {!!players.length && (
            <div className="mt-8">
              <h3 className="font-medium text-md uppercase">
                <span>Jugadores: {players.length}</span>
              </h3>
              <div className="border-gray-300 border-t-2 mt-4 -mx-4">
                {players.map((player: IPlayer, index: number) => (
                  <div
                    key={index}
                    className={classnames([
                      'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                      player.id === room.adminId
                        ? 'bg-green-100'
                        : index % 2 === 0
                        ? 'bg-gray-100'
                        : 'bg-gray-200'
                    ])}
                  >
                    <div className="flex flex-auto items-center">
                      <p>{player.name}</p>
                      {player.id === room.adminId && (
                        <span className="bg-green-200 border-2 border-green-300 font-medium ml-4 px-2 py-1 rounded text-xs">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <Button
                        id="play"
                        onButtonClick={() => {
                          router.push(
                            `/sala/${roomName}/jugar?jugador=${player.id}`
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
