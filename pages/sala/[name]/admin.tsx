import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Button from '~/components/Button'
import InputText from '~/components/InputText'
import Message, { MessageType } from '~/components/Message'
import Players, { IPlayer } from '~/components/Players'
import fetcher from '~/utils/fetcher'
import { roomsRef } from '~/utils/firebase'

interface IPageProps {
  boardsDistribution: string[]
}

export default function AdminSala({ boardsDistribution }: IPageProps) {
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

  useEffect(() => {
    const getRoomData = async () => {
      setRoom({
        data: undefined,
        error: null,
        loading: true
      })

      try {
        const roomRef = roomsRef.doc(roomName)
        const roomDoc = await roomRef.get()

        if (!roomDoc.exists) {
          router.push('/')

          return
        }

        const data = roomDoc.data()

        setRoom({
          loading: false,
          error: null,
          data: data
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

  useDeepCompareEffect(() => {
    const updateRoom = async () => {
      const roomRef = roomsRef.doc(roomName)
      roomRef.update({ ...room.data })
    }

    if (roomName) updateRoom()
  }, [{ ...room.data }])

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

  const readyToPlay = async () => {
    setMessage({
      content: 'Sala configurada con éxito',
      type: 'success'
    })

    const snapshot = await roomsRef
      .doc(roomName)
      .collection('players')
      .get()

    let index = 0
    snapshot.forEach(p => {
      roomsRef
        .doc(roomName)
        .collection('players')
        .doc(p.id)
        .update({
          boards: boardsDistribution[index]
        })

      index++
    })

    onFieldChange([
      {
        key: 'readyToPlay',
        value: true
      }
    ])

    setTimeout(() => {
      router.push(`/sala/${roomName}`)
    }, 1000)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
          <h2 className="font-medium text-center text-xl">Administrar sala</h2>
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
                id="url"
                label="URL para unirse"
                value={`${window.location.host}/sala/${roomName}`}
                readonly
                onFocus={event => event.target.select()}
              />
              <InputText
                id="password"
                label="Contraseña"
                value={room.data.password}
                readonly
                onFocus={event => event.target.select()}
              />
              <InputText
                id="videoCall"
                label="URL de la videollamada"
                onInputChange={(key, value) => onFieldChange([{ key, value }])}
                value={room.data.videoCall || ''}
              />
              <Players adminId={room.data.adminId} onChange={onFieldChange} />
              <div className="mt-8">
                <Button
                  id="readyToPlay"
                  className="w-full"
                  disabled={!room.data.adminId}
                  onButtonClick={readyToPlay}
                >
                  <FiSmile className="text-2xl" />
                  <span className="ml-4">Jugar</span>
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

interface BoardsRes {
  boardsDistribution: string[]
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let data: BoardsRes

  if (process.env.NODE_ENV === 'production') {
    const res: Response = await fetcher(
      `http://${req.headers.host}/api/boards-distribution`
    )
    data = await res.json()
  } else {
    data = require('~/public/boards-distribution.json')
  }

  return {
    props: {
      ...data
    }
  }
}

export type Field = boolean | number[] | string | IPlayer[]
