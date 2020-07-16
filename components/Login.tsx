import React, { FormEvent, useState } from 'react'
import { FiLogIn } from 'react-icons/fi'
import useAuth from '~/hooks/useAuth'
import useToast from '~/hooks/useToast'
import Box from './Box'
import Button from './Button'
import Heading from './Heading'
import InputText from './InputText'

export default function Login() {
  const { signin } = useAuth()
  const { createToast, dismissToast, updateToast } = useToast()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [inProgress, setInProgress] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()

    setInProgress(true)

    const toastId = createToast('Logueando', 'information')

    signin(formData.email, formData.password)
      .then(
        () => {
          updateToast('Bienvenide', 'success', toastId)
        },
        () => {
          updateToast('Error al loguearte', 'error', toastId)
        },
      )
      .catch(error => {
        console.error(error)

        updateToast('Error al loguearte', 'error', toastId)
      })
      .finally(() => {
        setInProgress(false)

        setTimeout(() => {
          dismissToast(toastId)
        }, 2000)
      })
  }

  return (
    <Box>
      <Heading textAlign="center" type="h1">
        ¿Te conocemos?
      </Heading>
      <form onSubmit={onSubmit}>
        <fieldset disabled={inProgress}>
          <InputText
            id="email"
            label="Email"
            onChange={email =>
              setFormData({
                ...formData,
                email,
              })
            }
            value={formData.email}
          />
          <InputText
            id="password"
            label="Password"
            onChange={password =>
              setFormData({
                ...formData,
                password,
              })
            }
            type="password"
            value={formData.password}
            autoComplete="current-password"
          />
          <div className="flex justify-center mt-8">
            <Button
              aria-label="Login"
              type="submit"
              id="login"
              iconLeft={<FiLogIn />}
              disabled={!formData.email || !formData.password}
            >
              Login
            </Button>
          </div>
        </fieldset>
      </form>
    </Box>
  )
}
