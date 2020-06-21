import React, { Fragment } from 'react'
import { FiLogOut } from 'react-icons/fi'
import useAuth from '~/hooks/useAuth'
import useToast from '~/hooks/useToast'
import Box from './Box'
import Button from './Button'
import EventGenerator from './EventGenerator'
import Heading from './Heading'

interface Props {
  user: firebase.User
}

export default function Premium({ user }: Props) {
  const { signout } = useAuth()
  const { createToast, dismissToast } = useToast()

  const logout = () => {
    signout()

    const toastId = createToast('Adiós', 'success')

    setTimeout(() => {
      dismissToast(toastId)
    }, 2000)
  }

  return (
    <Fragment>
      <Box>
        <Heading textAlign="center" type="h1">
          Welcome, {user.email}
        </Heading>
        <div className="mt-4 text-center">
          <Button
            aria-label="signout"
            id="signout"
            onClick={logout}
            iconLeft={<FiLogOut />}
          >
            Logout
          </Button>
        </div>
      </Box>
      <div className="mt-4">
        <Box>
          <Heading textAlign="center" type="h2">
            Crear una evento
          </Heading>
          <div className="mt-4">
            <EventGenerator user={user} />
          </div>
        </Box>
      </div>
    </Fragment>
  )
}
