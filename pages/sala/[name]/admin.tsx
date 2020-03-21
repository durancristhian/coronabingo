import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Button from '~/components/Button'
import InputText from '~/components/InputText'
import Message from '~/components/Message'
import Players, { IPlayer } from '~/components/Players'
import Select from '~/components/Select'
import fetcher from '~/utils/fetcher'
import db from '~/utils/firebase'

export default function AdminSala({
  boardsDistribution
}: {
  boardsDistribution: string[]
}) {
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

  const assignBoards = () => {
    const players = room.data?.players

    onFieldChange([
      {
        key: 'players',
        // @ts-ignore
        value: players.map((p, i) => ({
          ...p,
          boards: boardsDistribution[i]
        }))
      },
      {
        key: 'readyToPlay',
        value: false
      }
    ])
  }

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

  const readyToPlay = () => {
    onFieldChange([
      {
        key: 'readyToPlay',
        value: true
      }
    ])
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
                onInputChange={(key, value) => onFieldChange([{ key, value }])}
                value={room.data.videoCall || ''}
              />
              <Players
                adminId={room.data.adminId}
                boards={boardsDistribution}
                id="players"
                onPlayersChange={onFieldChange}
                players={room.data.players || []}
              />
              <div className="mt-8">
                <Select
                  disabled={!room.data.players?.length || false}
                  id="adminId"
                  label="Admin de la sala"
                  onInputChange={(key, value) =>
                    onFieldChange([{ key, value }])
                  }
                  options={room.data.players || []}
                  value={room.data.adminId}
                />
              </div>
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

export type Field = boolean | string | IPlayer[]
