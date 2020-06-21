import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { FormEvent, Fragment, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Button from '~/components/Button'
import InputText from '~/components/InputText'
import { Player, Room, RoomBase } from '~/interfaces'
import playerApi from '~/models/player'
import { MAX_PLAYERS } from '~/utils'

interface Props {
  isFormDisabled: boolean
  players: Player[]
  room: Room
  setPlayers: (array: Player[]) => void
  updateRoom: (data: Partial<RoomBase>) => void
}

export default function Players({
  isFormDisabled,
  players,
  room,
  setPlayers,
  updateRoom,
}: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  const onRemovePlayer = (index: number, player: Player) => {
    const cleanAdmin = room.adminId === player.id
    const changes: Partial<RoomBase> = {}

    if (cleanAdmin) {
      changes.adminId = ''
      changes.readyToPlay = false
    }

    updateRoom(changes)

    const playersCopy = [...players]
    playersCopy.splice(index, 1)

    setPlayers(playersCopy)

    playerApi.removePlayer(player)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    const { playerId, playerRef, playerData } = playerApi.createPlayer(room, {
      name,
    })

    /* TODO: review this */
    setPlayers([
      ...players,
      {
        id: playerId,
        ref: playerRef,
        ...playerData,
      },
    ])

    setName('')
  }

  const isCurrentNameRepeated =
    Boolean(players.length) && players.some(p => p.name === name)

  return (
    <div className="mt-8">
      <p className="flex items-center">
        <span className="mr-1">{t('admin:players.title')}</span>
        <span
          className={classnames([
            players.length === MAX_PLAYERS && 'text-red-600',
          ])}
        >
          {t('admin:players.amount', {
            amount: players.length,
            max: MAX_PLAYERS,
          })}
        </span>
      </p>
      <form onSubmit={onSubmit}>
        <fieldset disabled={players.length === MAX_PLAYERS || isFormDisabled}>
          <div className="flex items-end">
            <div className="flex-auto">
              <InputText
                id="name"
                label={t('admin:players.field-name')}
                onChange={setName}
                value={name}
              />
            </div>
            <div className="mb-4 ml-4">
              <Button
                id="add-player"
                aria-label={t('admin:players.add-player')}
                className="w-full"
                color="green"
                type="submit"
                disabled={!name || isCurrentNameRepeated}
                iconLeft={<FiPlus />}
              />
            </div>
          </div>
        </fieldset>
      </form>
      {!!players.length && (
        <div
          className="border-gray-300 border-t-2 mt-4 -mx-4"
          id="players-list"
        >
          {players.map((player, index) => (
            <div
              key={index}
              className={classnames([
                'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                player.id === room.adminId
                  ? 'bg-green-100'
                  : index % 2 === 0
                  ? 'bg-gray-100'
                  : 'bg-gray-200',
              ])}
            >
              <div className="flex flex-auto items-center">
                <p>{player.name}</p>
                {player.id === room.adminId && (
                  <span className="bg-green-200 border-2 border-green-300 font-medium ml-4 px-2 py-1 rounded text-xs">
                    {t('admin:players.admin')}
                  </span>
                )}
              </div>
              <div className="ml-4">
                <Button
                  aria-label={t('admin:players.remove-player')}
                  color="red"
                  id={`remove-player-${index + 1}`}
                  onClick={() => onRemovePlayer(index, player)}
                  disabled={isFormDisabled}
                  iconLeft={<FiTrash2 />}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
