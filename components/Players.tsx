import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { FormEvent, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Button from '~/components/Button'
import InputText from '~/components/InputText'
import Message from '~/components/Message'
import usePendingOperation from '~/hooks/usePendingOperation'
import { Player } from '~/interfaces/models/Player'
import { Room, RoomBase } from '~/interfaces/models/Room'
import playerApi from '~/models/player'
import { MAX_PLAYERS } from '~/utils/constants'

interface Props {
  isFormDisabled: boolean
  onPendingChange?: (pending: boolean) => void
  players: Player[]
  room: Room
  setPlayers: (array: Player[]) => void
  updateRoom: (data: Partial<RoomBase>) => void
}

export default function Players({
  isFormDisabled,
  onPendingChange,
  players,
  room,
  setPlayers,
  updateRoom,
}: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [removeError, setRemoveError] = useState(false)
  const { pending, run } = usePendingOperation()

  const onRemovePlayer = (index: number, player: Player) => {
    void run(async () => {
      setRemoveError(false)
      onPendingChange?.(true)
      try {
        // Do not create a removal draft before Firestore confirms deletion.
        await player.ref.delete()
        if (room.adminId === player.id) {
          updateRoom({ adminId: '', readyToPlay: false })
        }
        setPlayers(players.filter((_, playerIndex) => playerIndex !== index))
      } catch {
        setRemoveError(true)
      } finally {
        onPendingChange?.(false)
      }
    })
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
      {removeError && (
        <div role="alert">
          <Message type="error">{t('admin:players.remove-error')}</Message>
        </div>
      )}
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
        <fieldset
          disabled={players.length === MAX_PLAYERS || isFormDisabled || pending}
        >
          <div className="flex items-end">
            <div className="cb-player-field flex-auto">
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
          className="cb-list border-gray-300 border-t-2 mt-4 -mx-4"
          id="players-list"
        >
          {players.map((player, index) => (
            <div
              key={index}
              className={classnames([
                'cb-list-row cb-player-row',
                'border-b-2 border-gray-300 flex items-center justify-between px-4 py-2',
                player.id === room.adminId && 'cb-player-row--host',
              ])}
            >
              <div className="cb-player-details flex flex-auto items-center">
                <p className="cb-player-name">{player.name}</p>
                {player.id === room.adminId && (
                  <span className="cb-badge border-2 font-medium ml-4 px-2 py-1 text-xs">
                    {t('admin:players.admin')}
                  </span>
                )}
              </div>
              <div className="cb-player-actions">
                <Button
                  aria-label={t('admin:players.remove-player')}
                  color="red"
                  id={`remove-player-${index + 1}`}
                  onClick={() => onRemovePlayer(index, player)}
                  disabled={isFormDisabled || pending}
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
