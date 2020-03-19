import classnames from 'classnames'
import { useState } from 'react'
import {
  FiCircle,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
  FiCheck
} from 'react-icons/fi'
import Button from '../components/Button'
import InputText from '../components/InputText'

export default function Players({ id, onAddPlayer, onRemovePlayer, players }) {
  const [formData, setFormData] = useState(defaultFormData)
  /* TODO: There can be 2 people with the same name */
  const [adminName, setAdminName] = useState('')

  const onFieldChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  const onSubmit = event => {
    event.preventDefault()

    if (formData.name) {
      setFormData(defaultFormData)
      onAddPlayer(id, [...players, { name: formData.name }])
    }
  }

  return (
    <div className="my-8">
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
                onChange={onFieldChange}
                value={formData.name}
              />
            </div>
            <div className="mb-4 ml-4">
              <Button
                className="w-full"
                color="green"
                type="submit"
                disabled={!formData.name}
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
              <div className="mr-4">
                <button
                  onClick={() => {
                    setAdminName(player.name)
                  }}
                  className="mt-1"
                >
                  {adminName === player.name ? (
                    <FiCheckCircle className="text-blue-500 text-xl" />
                  ) : (
                    <FiCircle className="text-xl" />
                  )}
                </button>
              </div>
              <div className="flex-auto">
                <p>{player.name}</p>
              </div>
              <div className="ml-4">
                <Button
                  onClick={() => onRemovePlayer(id, player.name)}
                  color="red"
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

const defaultFormData = {
  name: ''
}
const MAX_PLAYERS = 30
