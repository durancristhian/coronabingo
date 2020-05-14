import React, { FormEvent, useState } from 'react'

interface Props {
  login: (password: string) => void
}

export default function AdminPassword({ login }: Props) {
  const [password, setPassword] = useState('')
  const [visible, setVisibility] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    login(password)
  }

  const togglePassword = () => {
    setVisibility(!visible)
  }

  return (
    <div>
      <h1>Pedir contraseña</h1>
      <form onSubmit={onSubmit}>
        <input
          type={visible ? 'text' : 'password'}
          name="admin-password"
          id="admin-password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          autoComplete="off"
        />
        <button
          onClick={togglePassword}
          className="border-2 pa-1"
          type="button"
        >
          {visible ? 'Ocultar' : 'Mostrar'}
        </button>
        <button type="submit" className="border-2 pa-1" disabled={!password}>
          Validar
        </button>
      </form>
    </div>
  )
}
