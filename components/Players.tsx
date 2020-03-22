import classnames from 'classnames'
import { FormEvent, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { v4 as uuid } from 'uuid'
import { Field } from '~/pages/sala/[name]/admin'
import { MAX_PLAYERS } from '~/utils/constants'
import Button from './Button'
import InputText from './InputText'

interface IProps {
  adminId: string
  boards: string[]
  id: string
  onPlayersChange: (changes: { key: string; value: Field }[]) => void
  players: IPlayer[]
}

export default function Players({
  adminId,
  boards,
  id,
  onPlayersChange,
  players
}: IProps) {
  const [name, setName] = useState('')

  const onFieldChange = (_key: string, value: string) => {
    setName(value)
  }

  const onRemovePlayer = (admin: string) => {
    const cleanAdmin = players.find(p => p.id === adminId)?.id === admin
    const changes: { key: string; value: Field }[] = [
      {
        key: id,
        value: players
          .filter(p => p.id !== admin)
          .sort((p1: IPlayer, p2: IPlayer) =>
            p1.name
              .toLocaleLowerCase()
              .localeCompare(p2.name.toLocaleLowerCase())
          )
      }
    ]

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

    onPlayersChange(changes)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    setName('')

    onPlayersChange([
      {
        key: id,
        value: [
          /* TODO: en every player added I'm mutating all the collection because of the index 🤭 */
          ...players.map((p, i) => ({ ...p, boards: boards[i] })),
          {
            boards: boards[players.length],
            id: uuid(),
            name,
            selectedNumbers: []
          }
        ].sort((p1: IPlayer, p2: IPlayer) =>
          p1.name.toLocaleLowerCase().localeCompare(p2.name.toLocaleLowerCase())
        )
      }
    ])
  }

  return (
    <div className="mb-4 mt-8">
      <div className="font-medium text-md uppercase">
        <h3 className="flex font-medium items-center text-md uppercase">
          <span>Jugadores:&nbsp;</span>
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
                    Admin
                  </span>
                )}
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
  boards: string
  id: string
  name: string
  selectedNumbers: number[]
}
