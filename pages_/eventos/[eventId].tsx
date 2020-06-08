import { useRouter } from 'next/router'
import React from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import { Events } from '~/interfaces'

export const EVENTS: Events = {
  'coronabingo-solidario': {
    endpoints: {
      email: 'https://hooks.palabra.io/js?id=96',
    },
    roomId: 'jQ3K1pU1OLuG7QzaZuCx',
    spreadsheetId: '1gwJIIPX2gs696_fq3HQQntXhg-mFwREVVyd831GWF8c',
    spreadsheetURL: 'https://forms.gle/FMxzniFaYw6jWLsW8',
    worksheetTitle: 'Respuestas de formulario 1',
  },
}

export default function EventId() {
  const router = useRouter()
  const eventId = router.query.eventId?.toString()

  if (!eventId || !Object.keys(EVENTS).includes(eventId || '')) {
    return (
      <Layout>
        <Container>
          <Message type="error">
            El evento que estás buscando no existe.
          </Message>
        </Container>
      </Layout>
    )
  }

  const event = EVENTS[eventId]

  const registerMe = () => {
    window.open(event.spreadsheetURL)
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
              aria-label="Quiero jugar"
              id="register-me"
              type="submit"
              onClick={registerMe}
            >
              <FiChevronsRight />
              <span className="mx-4">Quiero jugar</span>
              <FiChevronsLeft />
            </Button>
          </div>
        </Box>
      </Container>
    </Layout>
  )
}
