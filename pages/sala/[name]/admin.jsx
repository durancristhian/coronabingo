import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiCheckCircle, FiSmile } from 'react-icons/fi'
import useSWR from 'swr'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Button from '../../../components/Button'
import InputText from '../../../components/InputText'
import Message from '../../../components/Message'
import Players from '../../../components/Players'
import SelectedNumbers from '../../../components/SelectedNumbers'
import db from '../../../firebase'
import fetcher from '../../../utils/fetcher'

export default function AdminSala() {
  const url = '/api/boards-distribution'
  const { data, error } = useSWR(url, fetcher)
  const router = useRouter()
  const { name } = router.query
  const [formData, setFormData] = useState({
    players: [],
    videocall: '',
    selectedNumbers: [],
    readyToPlay: false
  })
  const [canPlay, setCanPlay] = useState(false)
  const [canAssignBoards, setCanAssignBoards] = useState(false)
  const [room, setRoom] = useState({})

  if (error) {
    return (
      <Message>
        <p>Hubo un error.</p>
      </Message>
    )
  }

  useEffect(() => {
    const getDocument = async () => {
      if (!name) return

      const room = await db
        .collection('rooms')
        .doc(name)
        .get()

      if (room.exists) {
        const roomData = room.data()

        setRoom(roomData)
        setFormData({
          ...formData,
          players: roomData.players,
          videocall: roomData.videocall
        })
      }
    }

    getDocument()
  }, [name])

  useDeepCompareEffect(() => {
    if (!name) return

    const rooms = db.collection('rooms').doc(name)

    rooms.set(formData, { merge: true })

    setCanAssignBoards(formData.players.length > 1)
  }, [formData])

  const onFieldChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  const onRemovePlayer = (key, value) => {
    const nextState = [...formData.players]
    const index = nextState.findIndex(p => p.name === value)

    nextState.splice(index, 1)

    setFormData({
      ...formData,
      [key]: nextState
    })
  }

  const assignBoards = () => {
    const players = [...formData.players]
    const withBoards = players.map((player, index) => ({
      ...player,
      boards: data.boardsDistribution[index]
    }))

    setFormData({
      ...formData,
      players: withBoards
    })

    setCanPlay(true)
  }

  const onFinish = () => {
    onFieldChange('readyToPlay', true)
  }

  const onSelectNumber = number => {
    const nextState = [...formData.selectedNumbers]
    const index = nextState.findIndex(n => n === number)

    if (index !== -1) {
      nextState.splice(index, 1)
    } else {
      nextState.push(number)
    }

    onFieldChange('selectedNumbers', nextState)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white md:w-2/4 mx-auto px-4 py-8 rounded shadow">
          <div className="mb-8">
            <h2 className="font-medium text-center text-xl">
              Administrar sala
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
            id="url"
            label="URL para unirse"
            value={name ? `${window.location.host}/sala/${name}` : ''}
            readonly
            onFocus={event => event.target.select()}
          />
          <InputText
            id="password"
            label="Contraseña"
            value={room.password || ''}
            readonly
            onFocus={event => event.target.select()}
          />
          <InputText
            id="videocall"
            label="URL de la videollamada"
            onChange={onFieldChange}
            value={formData.videocall}
          />
          <Players
            id="players"
            onAddPlayer={onFieldChange}
            onRemovePlayer={onRemovePlayer}
            players={formData.players || []}
          />
          <div className="mt-8">
            <Button
              className="w-full"
              disabled={!canAssignBoards}
              onClick={assignBoards}
              type="submit"
            >
              <FiCheckCircle className="text-2xl" />
              <span className="ml-4">Asignar cartones</span>
            </Button>
          </div>
          <div className="mt-8">
            <Button
              className="w-full"
              disabled={!canPlay}
              onClick={onFinish}
              type="submit"
            >
              <FiSmile className="text-2xl" />
              <span className="ml-4">A jugar</span>
            </Button>
          </div>
        </div>
        {formData.readyToPlay && (
          <SelectedNumbers
            numbers={NUMBERS}
            selectedNumbers={formData.selectedNumbers}
            onSelectNumber={onSelectNumber}
          />
        )}
      </div>
    </div>
  )
}

const NUMBERS = [...Array(90).keys()].map(n => n + 1)
