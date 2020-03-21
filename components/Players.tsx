import classnames from 'classnames'
import { FormEvent, useState } from 'react'
import { FiCheckCircle, FiCircle, FiPlus, FiTrash2 } from 'react-icons/fi'
import { v4 as uuid } from 'uuid'
import { MAX_PLAYERS } from '~/utils/constants'
import Button from './Button'
import InputText from './InputText'

interface IProps {
  id: string
  onPlayersChange: (id: string, value: IPlayer[]) => void
  players: IPlayer[]
}

export default function Players({ id, onPlayersChange, players }: IProps) {
  const [name, setName] = useState('')

  /* const onAdminChange = (adminId: string) => {
    onPlayersChange(
      id,
      players.map(p => ({ ...p, isAdmin: p.id === adminId }))
    )
  } */

  const onFieldChange = (_key: string, value: string) => {
    setName(value)
  }

  const onRemovePlayer = (adminId: string) => {
    onPlayersChange(
      id,
      players.filter(p => p.id !== adminId)
    )
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    setName('')

    onPlayersChange(id, [
      ...players,
      {
        id: uuid(),
        name,
        isAdmin: false
      }
    ])
  }

  return (
    <div className="my-4">
      <div className="flex justify-between">
        <h3 className="font-medium text-md uppercase">Jugadores</h3>
        <span
          className={classnames([
            'font-medium',
            players.length === MAX_PLAYERS && 'text-red-700'
          ])}
        >
          {players.length}/{MAX_PLAYERS}
        </span>
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
                onInputChange={onFieldChange}
                value={name}
              />
            </div>
            <div className="mb-4 ml-4">
              <Button
                className="w-full"
                color="green"
                type="submit"
                disabled={!name}
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
                index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
              ])}
            >
              {/* <div className="mr-4">
                <button
                  className="focus:outline-none focus:shadow-outline mt-1 text-xl"
                  onClick={() => {
                    onAdminChange(player.id)
                  }}
                >
                  {player.isAdmin ? (
                    <FiCheckCircle className="text-blue-600" />
                  ) : (
                    <FiCircle />
                  )}
                </button>
              </div> */}
              <div className="flex-auto">
                <p>{player.name}</p>
              </div>
              <div className="ml-4">
                <Button
                  color="red"
                  id="remove-player"
                  onButtonClick={() => onRemovePlayer(player.id)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export interface IPlayer {
  id: string
  name: string
  isAdmin: boolean
}
