import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { FiCheckCircle, FiCircle, FiPlus, FiTrash2 } from 'react-icons/fi'
import Button from '../components/Button'
import InputText from '../components/InputText'

export default function Players({
  adminName,
  id,
  onAddPlayer,
  onAdminChange,
  onRemovePlayer,
  players
}) {
  const [formData, setFormData] = useState(defaultFormData)
  /* TODO: There can be 2 people with the same name */
  const [admin, setAdmin] = useState(adminName || '')

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

  useEffect(() => {
    onAdminChange(admin)
  }, [admin])

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
                    setAdmin(player.name)
                  }}
                  className="focus:outline-none focus:shadow-outline mt-1 text-xl"
                >
                  {admin === player.name ? (
                    <FiCheckCircle className="text-blue-600" />
                  ) : (
                    <FiCircle />
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
