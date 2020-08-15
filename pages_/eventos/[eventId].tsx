import { isAfter } from 'date-fns'
import React, { FormEvent, useState } from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Heading from '~/components/Heading'
import InputImage from '~/components/InputImage'
import InputText from '~/components/InputText'
import InputTextarea from '~/components/InputTextarea'
import Layout from '~/components/Layout'
import Loading from '~/components/Loading'
import Message from '~/components/Message'
import { useAnalytics } from '~/hooks/useAnalytics'
import useEvent from '~/hooks/useEvent'
import useSubCollection from '~/hooks/useSubCollection'
import useToast from '~/hooks/useToast'
import { createBatch, storage, Timestamp } from '~/utils'

const defaultFormData = {
  attachment: '',
  comment: '',
  date: Timestamp.now(),
  extension: '',
  name: '',
  tel: '',
}

export default function EventId() {
  const { error, loading, event } = useEvent()
  const {
    data: registrations,
    error: registrationsError,
    loading: registrationsLoading,
  } = useSubCollection('events', event?.id, 'registrations')
  const { createToast, dismissToast, updateToast } = useToast()
  const [inProgress, setInProgress] = useState(false)
  const [formData, setFormData] = useState(defaultFormData)
  const log = useAnalytics()

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Message type="error">
          Ocurrió un error al cargar la página. Intenta cargala de nuevo.
        </Message>
      </Layout>
    )
  }

  if (registrationsLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  if (registrationsError) {
    return (
      <Layout>
        <Message type="error">
          Ocurrió un error al cargar la página. Intenta cargala de nuevo.
        </Message>
      </Layout>
    )
  }

  if (!event || !registrations) return null

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const toastId = createToast('Enviando...', 'information')

    try {
      setInProgress(true)

      const batch = createBatch()
      const registrationRef = event.ref.collection('registrations').doc()

      const { attachment, extension, ...registrationData } = formData

      const attachmentRef = storage.child(
        `${event.id}/${registrationRef.id}/attachment.${extension}`,
      )
      const attachmentSnapshot = await attachmentRef.putString(
        attachment,
        'data_url',
      )

      batch.set(registrationRef, {
        ...registrationData,
        attachment: attachmentSnapshot.metadata.fullPath,
        date: Timestamp.fromDate(new Date()),
      })

      await batch.commit()

      updateToast('Operación exitosa', 'success', toastId)
    } catch (error) {
      console.error(error)

      log('event_registration_error', {
        description: error.message,
        fatal: true,
      })

      updateToast('Ups! Hubo un error', 'error', toastId)
    } finally {
      setFormData(defaultFormData)

      setInProgress(false)

      setTimeout(() => {
        dismissToast(toastId)
      }, 10000)
    }
  }

  const form = () => {
    const today = new Date()
    const end = new Date(2020, 7, 15, 15, 30)

    if (isAfter(today, end)) {
      return (
        <Message type="information">
          Las inscripciones ya no están disponibles.
        </Message>
      )
    }

    return (
      <>
        <Heading type="h2">Inscripción</Heading>
        <form onSubmit={onSubmit}>
          <fieldset disabled={inProgress}>
            <InputText
              id="name"
              label="Nombre"
              value={formData.name}
              onChange={name => {
                setFormData({ ...formData, name })
              }}
            />
            <InputText
              id="tel"
              label="Teléfono"
              value={formData.tel}
              onChange={tel => {
                setFormData({ ...formData, tel })
              }}
            />
            <InputImage
              id="attachment"
              label="Comprobante de la donación"
              image={formData.attachment}
              onChange={(attachment, extension) => {
                setFormData({ ...formData, attachment, extension })
              }}
            />
            <InputTextarea
              id="comment"
              label="Comentario"
              value={formData.comment}
              onChange={comment => {
                setFormData({ ...formData, comment })
              }}
            />
            <div className="mt-8 text-center">
              <Button
                aria-label="Quiero jugar"
                id="register-me"
                type="submit"
                disabled={
                  !formData.name || !formData.attachment || !formData.tel
                }
                color="green"
                iconLeft={<FiChevronsRight />}
                iconRight={<FiChevronsLeft />}
              >
                Enviar
              </Button>
            </div>
          </fieldset>
        </form>
        <div className="mt-4">
          <Message type="information">
            <p>
              Si tenés algún problema con el formulario contactanos a este
              mail:&nbsp;
              <strong>durancristhian@gmail.com</strong>
            </p>
          </Message>
        </div>
      </>
    )
  }

  const fullRoom = () => {
    return (
      <Message type="information">
        Se completó el cupo de 450 personas inscriptas para el evento.
      </Message>
    )
  }

  return (
    <Layout>
      <Box>
        <Heading textAlign="center" type="h1">
          {event.name}
        </Heading>
        <div
          className="markdown-body my-8"
          dangerouslySetInnerHTML={{ __html: event.content.html }}
        />
        {registrations.length < 450 ? form() : fullRoom()}
      </Box>
    </Layout>
  )
}
