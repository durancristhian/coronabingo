import React from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'

export default function EventId() {
  const onRegisterClick = () => {
    window.open('https://forms.gle/FMxzniFaYw6jWLsW8')
  }

  return (
    <Layout>
      <Container size="medium">
        <Box>
          <div className="text-center">
            <Heading type="h1">Coronabingo Solidario</Heading>
          </div>
          <div className="my-8">
            <p>Esta es la descripción del evento.</p>
          </div>
          <div className="text-center">
            <Button
              aria-label="Registrarme"
              id="register-me"
              type="submit"
              onClick={onRegisterClick}
            >
              <FiChevronsRight />
              <span className="mx-4">Registrarme</span>
              <FiChevronsLeft />
            </Button>
          </div>
        </Box>
      </Container>
    </Layout>
  )
}
