import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import InputText from '~/components/InputText'
import Message from '~/components/Message'
import Players, { IPlayer } from '~/components/Players'
import db from '~/utils/firebase'

export default function AdminSala() {
  const router = useRouter()
  const name = router.query.name?.toString()
  const [room, setRoom] = useState<{
    data: firebase.firestore.DocumentData | undefined
    error: string | null
    loading: boolean
  }>({
    data: undefined,
    error: null,
    loading: false
  })

  useEffect(() => {
    const getRoomData = async () => {
      setRoom({
        data: undefined,
        error: null,
        loading: true
      })

      try {
        const roomRef = db.collection('rooms').doc(name)
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

    if (name) getRoomData()
  }, [name])

  useDeepCompareEffect(() => {
    const updateRoom = async () => {
      const roomRef = db.collection('rooms').doc(name)
      roomRef.update({ ...room.data })
    }

    if (name) updateRoom()
  }, [{ ...room.data }])

  const onFieldChange = (key: string, value: string | IPlayer[]) => {
    setRoom({
      ...room,
      data: {
        ...room.data,
        [key]: value
      }
    })
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
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
              Cargando información de la sala
            </Message>
          )}
          {room.data && (
            <Fragment>
              <InputText
                id="room-name"
                label="Nombre"
                value={name}
                readonly
                onFocus={event => event.target.select()}
              />
              <InputText
                id="url"
                label="URL para unirse"
                value={`${window.location.host}/sala/${name}`}
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
                onInputChange={onFieldChange}
                value={room.data.videoCall || ''}
              />
              <Players
                id="players"
                onPlayersChange={onFieldChange}
                players={room.data.players || []}
              />
            </Fragment>
          )}
        </div>
      </div>
    </div>
  )
}
