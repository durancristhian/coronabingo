import classnames from 'classnames'
import { FormEvent, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Select from '~/components/Select'
import { Field } from '~/pages/sala/[name]/admin'
import { MAX_PLAYERS } from '~/utils/constants'
import { roomsRef } from '~/utils/firebase'
import Button from './Button'
import InputText from './InputText'

interface IProps {
  adminId: string
  onChange: (changes: { key: string; value: Field }[]) => void
  players: IPlayer[]
  removePlayer: Function
  roomName: string
  setPlayers: Function
}

export default function Players({
  adminId,
  onChange,
  players,
  removePlayer,
  roomName,
  setPlayers
}: IProps) {
  const [name, setName] = useState('')

  const onFieldChange = (value: string) => {
    setName(value)
  }

  const onRemovePlayer = (index: number, player: IPlayer) => {
    const cleanAdmin = adminId === player.id
    const changes = []

    if (cleanAdmin) {
      changes.push({
        key: 'adminId',
        value: ''
      })

      changes.push({
        key: 'readyToPlay',
        value: false
      })
    }

    onChange(changes)

    const playersCopy = [...players]
    playersCopy.splice(index, 1)

    setPlayers(playersCopy)

    removePlayer(player.id)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setPlayers(
      [
        ...players,
        {
          boards: '',
          /* TODO: extract this to somewhere else. Maybe db utils */
          id: roomsRef
            .doc(roomName)
            .collection('players')
            .doc().id,
          name,
          selectedNumbers: []
        }
      ].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    )

    setName('')
  }

  const isNameRepeated =
    Boolean(players.length) && players.some(p => p.name === name)

  return (
    <div className="mt-8">
      <div className="font-medium text-md">
        <h3 className="flex font-medium items-center text-md">
          <span>Personas que van a jugar:&nbsp;</span>
          <span
            className={classnames([
              players.length === MAX_PLAYERS && 'text-red-600'
            ])}
          >
            {players.length} de {MAX_PLAYERS}
          </span>
        </h3>
      </div>
      <form onSubmit={onSubmit}>
        <fieldset
          className="disabled:opacity-50"
          disabled={players.length === MAX_PLAYERS}
        >
          <div className="flex items-end">
            <div className="flex-auto">
              <InputText
                id="name"
                label="Nombre *"
                onChange={onFieldChange}
                value={name}
              />
            </div>
            <div className="mb-4 ml-4">
              <Button
                className="w-full"
                color="green"
                type="submit"
                disabled={!name || isNameRepeated}
              >
                <FiPlus />
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
      {!!players.length && (
        <div className="border-gray-300 border-t-2 mt-4 -mx-4">
          {players.map((player, index) => (
            <div
              key={index}
              className={classnames([
                'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                player.id === adminId
                  ? 'bg-green-100'
                  : index % 2 === 0
                  ? 'bg-gray-100'
                  : 'bg-gray-200'
              ])}
            >
              <div className="flex flex-auto items-center">
                <p>{player.name}</p>
                {player.id === adminId && (
                  <span className="bg-green-200 border-2 border-green-300 font-medium ml-4 px-2 py-1 rounded text-xs">
                    Dirige el juego
                  </span>
                )}
              </div>
              <div className="ml-4">
                <Button
                  color="red"
                  id="remove-player"
                  onClick={() => onRemovePlayer(index, player)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4">
        <Select
          disabled={!players.length}
          id="adminId"
          label="Dirige el juego"
          onChange={value => onChange([{ key: 'adminId', value }])}
          options={players}
          value={adminId}
        />
      </div>
      <div className="italic leading-normal -mt-6 text-gray-600 text-sm">
        <p className="my-8">
          Elegí la persona que se va a hacer cargo de marcar los números para
          que el resto se entere.
        </p>
      </div>
    </div>
  )
}

export interface IPlayer {
  boards: string
  id: string
  name: string
}
