import Error from 'next/error'
import React, { FormEvent, useState } from 'react'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import Box from '~/components/Box'
import Button from '~/components/Button'
import Container from '~/components/Container'
import Heading from '~/components/Heading'
import InputImage from '~/components/InputImage'
import InputText from '~/components/InputText'
import InputTextarea from '~/components/InputTextarea'
import Layout from '~/components/Layout'
import Message from '~/components/Message'
import useEvent from '~/hooks/useEvent'
import useToast from '~/hooks/useToast'
import { createBatch } from '~/utils'

const defaultFormData = {
  name: '',
  email: '',
  tel: '',
  payment: '',
  comment: '',
}

interface Props {
  hidden: boolean
}

export default function EventId({ hidden }: Props) {
  const { error, loading, event } = useEvent()
  const { createToast, dismissToast, updateToast } = useToast()
  const [inProgress, setInProgress] = useState(false)
  const [formData, setFormData] = useState(defaultFormData)

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

  if (hidden) {
    return <Error statusCode={404} />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    /* TODO: validar */

    const toastId = createToast('Enviando...', 'information')

    try {
      setInProgress(true)

      const batch = createBatch()
      const registrationRef = event.ref.collection('registrations').doc()

      batch.set(registrationRef, formData)

      batch.commit()

      updateToast('Operación exitosa', 'success', toastId)
    } catch (error) {
      console.error(error)

      updateToast('Ups! Hubo un error', 'error', toastId)
    } finally {
      setFormData(defaultFormData)

      setInProgress(false)

      setTimeout(() => {
        dismissToast(toastId)
      }, 2000)
    }
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
          <Heading type="h2">Inscripción</Heading>
          <form onSubmit={onSubmit}>
            <fieldset disabled={inProgress}>
              <InputText
                id="name"
                label="Nombre completo"
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
              <InputText
                id="email"
                label="Email"
                value={formData.email}
                onChange={email => {
                  setFormData({ ...formData, email })
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
              <InputImage
                id="payment"
                label="Comprobante de la donación"
                image={formData.payment}
                onChange={payment => {
                  setFormData({ ...formData, payment })
                }}
              ></InputImage>
              <div className="mt-8 text-center">
                <Button
                  aria-label="Quiero jugar"
                  id="register-me"
                  type="submit"
                  color="green"
                >
                  <FiChevronsRight />
                  <span className="mx-4">Enviar</span>
                  <FiChevronsLeft />
                </Button>
              </div>
            </fieldset>
          </form>
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
