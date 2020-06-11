import Error from 'next/error'
import { useRouter } from 'next/router'
import React from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import { EVENTS } from '~/utils'

interface Props {
  hidden: boolean
}

export default function EventId({ hidden }: Props) {
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

  if (hidden) {
    return <Error statusCode={404} />
  }

  return (
    <Layout>
      <Container size="medium">
        <Box>
          <Heading textAlign="center" type="h1">
            Coronabingo Solidario
          </Heading>
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

export async function getStaticPaths() {
  return {
    paths: Object.keys(EVENTS).map(k => ({
      params: {
        eventId: k,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps() {
  return {
    props: {
      hidden: process.env.NODE_ENV === 'production',
    },
  }
}
