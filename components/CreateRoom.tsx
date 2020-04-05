import firebase from 'firebase'
import { useRouter } from 'next/router'
import React, {
  FormEvent, useEffect, useState, ReactNode,
} from 'react'
import { FiSmile } from 'react-icons/fi'
// @ts-ignore
import urlSlug from 'url-slug'
import { roomsRef } from '~/utils/firebase'
import isObjectFulfilled from '~/utils/isObjectFulfilled'
import Button from './Button'
import InputText from './InputText'
import Message, { MessageType } from './Message'

export default function CreateRoom() {
  const router = useRouter()
  const [canSubmit, setCanSubmit] = useState(false)
  const [formData, setFormData] = useState({
    name: ''
  })
  const [messageProps, setMessageProps] = useState<{
    message: string | ReactNode
    type: MessageType
  }>({
    message: '',
    type: 'information'
  })

  useEffect(() => {
    setCanSubmit(isObjectFulfilled(formData))
  }, [formData.name])

  const onFieldChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setMessageProps({
      message: 'Creando sala...',
      type: 'information'
    })

    const { name } = formData
    const roomName = urlSlug(name)
    const roomDoc = roomsRef.doc(roomName)
    const roomData = await roomDoc.get()

    if (roomData.exists) {
      setMessageProps({
        message: (
          <div>
            <span>Ya existe una sala con ese nombre, si vos la creaste clickea </span>
            <a
              href={`/sala/${roomName}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline"
            >
              acá
            </a>
            .
          </div>
        ),
        type: 'information',
      })

      return
    }

    await roomDoc.set({
      ...formData,
      name: roomName,
      date: firebase.firestore.Timestamp.fromDate(new Date())
    })

    setMessageProps({
      message: 'Sala creada con éxito. Espere...',
      type: 'success'
    })

    setTimeout(() => {
      router.push('/sala/[name]/admin', `/sala/${roomName}/admin`)
    }, 1000)
  }

  return (
    <>
      <h2 className="font-medium text-xl text-center uppercase">Crear sala</h2>
      <form onSubmit={onSubmit}>
        <InputText
          id="name"
          label="Nombre *"
          onChange={(value) => onFieldChange('name', value)}
          value={formData.name}
        />
        <div className="mt-8">
          <Button className="w-full" disabled={!canSubmit} type="submit">
            <FiSmile />
            <span className="ml-4">Listo</span>
          </Button>
        </div>
      </form>
      {messageProps.message && (
        <Message type={messageProps.type}>{messageProps.message}</Message>
      )}
    </>
  )
}
