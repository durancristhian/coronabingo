import { isBefore } from 'date-fns'
import isAfter from 'date-fns/isAfter'
import Router from 'next-translate/Router'
import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useAnalytics } from '~/hooks/useAnalytics'
import Button from './Button'
import Container from './Container'
import Heading from './Heading'

const EventBanner = () => {
  const log = useAnalytics()

  const goToEvent = () => {
    const route = Router.route

    log('click_event_banner', {
      description: route,
    })

    Router.pushI18n(
      '/eventos/[eventId]',
      '/eventos/coronabingo-solidario-por-minka',
    )
  }

  const today = new Date()
  const start = new Date(2020, 7, 11, 12)
  const end = new Date(2020, 7, 15, 15, 30)

  if (isAfter(today, start) && isBefore(today, end)) {
    return (
      <div className="bg-yellow-100 p-4">
        <Container>
          <div className="p-4">
            <Heading type="h2" textAlign="center">
              Coronabingo solidario
            </Heading>
            <div className="mt-4">
              <p>
                El sábado <strong>15 de Agosto</strong> jugaremos un Coronabingo
                para ayudar al <strong>Centro Comunitario Minka</strong>. ¿Te
                gustaría participar?
              </p>
            </div>
            <div className="mt-8">
              <Button
                aria-label="Anotate"
                className="w-full"
                color="green"
                id="event-register"
                iconLeft={<FiChevronRight />}
                iconRight={<FiChevronLeft />}
                onClick={goToEvent}
              >
                Conocé más
              </Button>
            </div>
            <p className="mt-4 text-center text-sm">
              * Sólo válido para Argentina
            </p>
          </div>
        </Container>
      </div>
    )
  }

  return null
}

export default EventBanner
