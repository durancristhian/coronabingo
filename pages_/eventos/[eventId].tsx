import Error from 'next/error'
import React from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import useEvent from '~/hooks/useEvent'

interface Props {
  hidden: boolean
}

export default function EventId({ hidden }: Props) {
  const { error, loading, event } = useEvent()

  if (loading) {
    return (
      <Layout>
        <Container>
          <Message type="information">
            Cargando información del evento...
          </Message>
        </Container>
      </Layout>
    )
  }

  if (error) {
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

  if (!event) return null

  const registerMe = () => {
    window.open(event.formURL)
  }

  if (hidden) {
    return <Error statusCode={404} />
  }

  return (
    <Layout>
      <Container size="medium">
        <Box>
          <Heading textAlign="center" type="h1">
            {event.eventName}
          </Heading>
          <div
            className="markdown-body my-8"
            dangerouslySetInnerHTML={{ __html: event.content.html }}
          />
          <div className="text-center">
            <Button
              aria-label="Quiero jugar"
              id="register-me"
              type="submit"
              color="green"
              onClick={registerMe}
            >
              <FiChevronsRight />
              <span className="mx-4">Formulario de inscripción</span>
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
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps() {
  return {
    props: {
      hidden: process.env.NODE_ENV === 'production',
    },
  }
}
