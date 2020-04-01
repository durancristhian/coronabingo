import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import Button from '~/components/Button'
import Checkbox from '~/components/Checkbox'
import InputText from '~/components/InputText'
import Message, { MessageType } from '~/components/Message'
import Players, { IPlayer } from '~/components/Players'
import useRandomBoards from '~/hooks/useRandomBoards'
import db, { roomsRef } from '~/utils/firebase'
import useRoomPlayers from '~/hooks/useRoomPlayers'

export default function Admin() {
  const router = useRouter()
  const roomName = router.query.name?.toString()
  const [room, setRoom] = useState<{
    data: firebase.firestore.DocumentData | undefined
    error: string | null
    loading: boolean
  }>({
    data: undefined,
    error: null,
    loading: false
  })
  const [message, setMessage] = useState<{
    content: string
    type: MessageType
  }>({
    content: '',
    type: 'information'
  })
  const [players, setPlayers] = useRoomPlayers(roomName)
  const randomBoards = useRandomBoards()

  useEffect(() => {
    const getRoomData = async () => {
      setRoom({
        data: undefined,
        error: null,
        loading: true
      })

      try {
        const roomDoc = roomsRef.doc(roomName)
        const roomData = await roomDoc.get()

        if (!roomData.exists) {
          router.push('/')

          return
        }

        setRoom({
          loading: false,
          error: null,
          data: roomData.data()
        })
      } catch (error) {
        setRoom({
          loading: false,
          error,
          data: undefined
        })
      }
    }

    if (roomName) getRoomData()
  }, [roomName])

  const onFieldChange = (changes: { key: string; value: Field }[]) => {
    setRoom({
      ...room,
      data: Object.assign(
        {},
        room.data,
        ...[...changes.map(({ key, value }) => ({ [key]: value }))]
      )
    })
  }

  const removePlayer = (playerId: string) => {
    roomsRef
      .doc(roomName)
      .collection('players')
      .doc(playerId)
      .delete()
  }

  const readyToPlay = async () => {
    setMessage({
      content: 'Sala configurada con éxito. Espere...',
      type: 'success'
    })

    let roomDoc = roomsRef.doc(roomName)

    let batch = db.batch()
    batch.update(roomDoc, { ...room.data, readyToPlay: true })

    players.map((player, index) => {
      const { id, name } = player

      batch.set(roomDoc.collection('players').doc(id), {
        name,
        boards: randomBoards[index],
        selectedNumbers: []
      })
    })

    await batch.commit()

    setTimeout(() => {
      router.push(`/sala/${roomName}`)
    }, 1000)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
          <h2 className="font-medium text-center text-xl">Preparar sala</h2>
          {room.error && (
            <Message type="error">
              Ocurrió un error al cargar la información de la sala. Intenta de
              nuevo recargando la página.
            </Message>
          )}
          {room.loading && (
            <Message type="information">
              Cargando información de la sala...
            </Message>
          )}
          {room.data && (
            <Fragment>
              <InputText
                id="room-name"
                label="Nombre"
                value={roomName}
                readonly
                onFocus={event => event.target.select()}
              />
              <InputText
                id="videoCall"
                label="Link a la videollamada"
                onChange={value => onFieldChange([{ key: 'videoCall', value }])}
                value={room.data.videoCall || ''}
              />
              <InputText
                id="url"
                label="Link a la sala"
                value={`${window.location.host}/sala/${roomName}`}
                readonly
                onFocus={event => event.target.select()}
              />
              <div className="italic leading-normal -mt-6 text-gray-600 text-sm">
                <p className="my-8">
                  Compartí este link a las personas de la videollamada.
                </p>
              </div>
              <Players
                players={players}
                setPlayers={setPlayers}
                adminId={room.data.adminId}
                onChange={onFieldChange}
                removePlayer={removePlayer}
                roomName={roomName}
              />
              <div className="mt-4">
                <Checkbox
                  id="turningGlob"
                  label="Usar bolillero online"
                  onChange={value =>
                    onFieldChange([{ key: 'turningGlob', value }])
                  }
                  value={room.data.turningGlob || false}
                />
              </div>
              <div className="italic leading-normal -mt-6 text-gray-600 text-sm">
                <p className="my-8">
                  Si tenés un bolillero y querés usarlo no tildes esta opción.
                  De lo contrario, tildala para tener un bolillero durante el
                  juego.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  id="readyToPlay"
                  className="w-full"
                  disabled={!room.data.adminId}
                  onClick={readyToPlay}
                >
                  <FiSmile className="text-2xl mr-4" />
                  <span>Jugar</span>
                </Button>
              </div>
            </Fragment>
          )}
          {message.content && (
            <Message type={message.type}>{message.content}</Message>
          )}
        </div>
      </div>
    </div>
  )
}

export type Field = boolean | number[] | string | IPlayer[]
