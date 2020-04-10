import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { FormEvent, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Select from '~/components/Select'
import Field from '~/interfaces/Field'
import { MAX_PLAYERS } from '~/utils/constants'
import Button from './Button'
import InputText from './InputText'

interface Props {
  adminId: string
  onChange: (changes: { key: string; value: Field }[]) => void
  players: Player[]
  removePlayer: Function
  roomRef: firebase.firestore.DocumentReference
  setPlayers: Function
}

export default function Players({
  adminId,
  onChange,
  players,
  removePlayer,
  roomRef,
  setPlayers,
}: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  const onFieldChange = (value: string) => {
    setName(value)
  }

  const onRemovePlayer = (index: number, player: Player) => {
    const cleanAdmin = adminId === player.id
    const changes = []

    if (cleanAdmin) {
      changes.push({
        key: 'adminId',
        value: '',
      })

      changes.push({
        key: 'readyToPlay',
        value: false,
      })
    }

    onChange(changes)

    const playersCopy = [...players]
    playersCopy.splice(index, 1)

    setPlayers(playersCopy)

    removePlayer(player.ref)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const playerDoc = roomRef.collection('players').doc()

    setPlayers([
      ...players,
      {
        boards: '',
        id: playerDoc.id,
        exists: false,
        ref: playerDoc,
        name,
        selectedNumbers: [],
      },
    ])

    setName('')
  }

  const isNameRepeated =
    Boolean(players.length) && players.some(p => p.name === name)

  return (
    <div className="mt-8">
      <p className="flex items-center">
        <span>{t('admin:players.title')}&nbsp;</span>
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
          className="disabled:opacity-50"
          disabled={players.length === MAX_PLAYERS}
        >
          <div className="flex items-end">
            <div className="flex-auto">
              <InputText
                id="name"
                label={t('admin:players.field-name')}
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
                  : 'bg-gray-200',
              ])}
            >
              <div className="flex flex-auto items-center">
                <p>{player.name}</p>
                {player.id === adminId && (
                  <span className="bg-green-200 border-2 border-green-300 font-medium ml-4 px-2 py-1 rounded text-xs">
                    {t('admin:players.admin')}
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
        <div className="my-4">
          <Select
            disabled={!players.length}
            hint={t('admin:players.field-admin-hint')}
            id="adminId"
            label={t('admin:players.field-admin')}
            onChange={value => onChange([{ key: 'adminId', value }])}
            options={players}
            value={adminId}
          />
        </div>
      </div>
    </div>
  )
}

export interface Player {
  boards: string
  id: string
  name: string
  exists: boolean
  ref: firebase.firestore.DocumentReference
}
