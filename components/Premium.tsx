import React from 'react'
import useAuth from '~/hooks/useAuth'
import useToast from '~/hooks/useToast'
import Box from './Box'
import Button from './Button'
import Heading from './Heading'

export default function Premium() {
  const { user, signout } = useAuth()
  const { createToast, dismissToast } = useToast()

  /* TODO: this should never happen */
  if (!user) return null

  const logout = () => {
    signout()

    const toastId = createToast('Adiós', 'success')

    setTimeout(() => {
      dismissToast(toastId)
    }, 2000)
  }

  console.log(user)

  return (
    <Box>
      <Heading textAlign="center" type="h1">
        Welcome
      </Heading>
      <div className="flex justify-center mt-8">
        <Button aria-label="signout" id="signout" onClick={logout}>
          Logout
        </Button>
      </div>
    </Box>
  )
}
