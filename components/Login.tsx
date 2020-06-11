import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import useAuth from '~/hooks/useAuth'
import useToast from '~/hooks/useToast'
import Box from './Box'
import Button from './Button'
import Heading from './Heading'

export default function Login() {
  const { signin } = useAuth()
  const { createToast, dismissToast, updateToast } = useToast()

  const login = () => {
    const toastId = createToast('Logueando', 'information')

    signin('durancristhian@gmail.com', 'cristhian')
      .then(
        () => {
          updateToast('Bienvenide', 'success', toastId)

          setTimeout(() => {
            dismissToast(toastId)
          }, 2000)
        },
        () => {
          updateToast('Error al loguearte', 'error', toastId)

          setTimeout(() => {
            dismissToast(toastId)
          }, 2000)
        },
      )
      .catch(error => {
        console.error(error)

        updateToast('Error al loguearte', 'error', toastId)
      })
  }

  return (
    <Box>
      <Heading textAlign="center" type="h1">
        ¿Te conocemos?
      </Heading>
      <div className="flex justify-center mt-8">
        <Button aria-label="Login" id="login" onClick={login}>
          <FiLogIn />
          <span className="ml-4">Login</span>
        </Button>
      </div>
    </Box>
  )
}
