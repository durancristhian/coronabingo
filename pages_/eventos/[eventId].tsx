import Error from 'next/error'
import { useRouter } from 'next/router'
import React from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Anchor from '~/components/Anchor'
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
          <div className="markdown-body my-4">
            <p>
              Estamos viviendo tiempos difíciles y por eso, con la idea de
              divertirnos y ayudar a quienes más lo necesitan, organizamos un
              bingo solidario para colaborar con el&nbsp;
              <Anchor
                href="https://www.instagram.com/minkacc/"
                id="Minka Centro Comunitario"
              >
                Centro Comunitario Minka
              </Anchor>
              .
            </p>
            <p>
              La actividad está pensada para jugar en familia, grupos de
              amigos/as y el público en general de Argentina.
            </p>
            <Heading type="h2">¿Cómo puedo participar?</Heading>
            <p>
              El juego tendrá lugar el <strong>Sábado 27 de Junio</strong> a
              las&nbsp;
              <strong>15:00 hs.</strong> por medio de una videollamada en la
              aplicación&nbsp;
              <Anchor href="https://zoom.us/" id="zoom">
                Zoom
              </Anchor>
              .
            </p>
            <p>
              Te podés inscribir completando en el formulario que encontrarás al
              final de está página donde te pedimos algunos datos de contacto
              para mandarte los cartones y un comprobante de una donación
              por&nbsp;<strong>Mercado Pago</strong> al mail&nbsp;
              <strong>centrocomunitariominka@gmail.com</strong> con un mínimo de
              50 pesos.
            </p>
            <p>
              Luego de verificar la información, te enviaremos por mail o
              WhatsApp el link a tus cartones y el link para la videollamada.
            </p>
            <Message type="information">
              Es requisito indispensable incluir en el formulario el comprobante
              de la donación para poder participar.
            </Message>
            <Heading type="h2">¿Qué necesito para jugar?</Heading>
            <ul>
              <li>
                Necesitas contar con una computadora, tablet o celular con
                conexión a internet.
              </li>
              <li>
                La aplicación&nbsp;
                <Anchor href="https://zoom.us/" id="zoom">
                  Zoom
                </Anchor>
                &nbsp;que se encuentra en todas las tiendas de aplicaciones.
              </li>
            </ul>
            <Heading type="h2">¿Hay premios?</Heading>
            <p>¡Obvio!, jugar al bingo sin premios sería muy aburrido.</p>
            <ul>
              <li>
                <span>Línea: </span>
                <strong>A definir</strong>
              </li>
              <li>
                <span>Cartón lleno: </span>
                <strong>A definir</strong>
              </li>
              <li>
                <span>Coronabingo (Los 2 cartones llenos): </span>
                <strong>A definir</strong>
              </li>
            </ul>
          </div>
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
