import firebase from 'firebase'
import { useRouter } from 'next/router'
import { FormEvent, Fragment, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
// @ts-ignore
import urlSlug from 'url-slug'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { v4 as uuid } from 'uuid'
import db from '../utils/firebase'
import isObjectFulfilled from '../utils/isObjectFulfilled'
import Button from './Button'
import InputText from './InputText'
import Message, { MessageType } from './Message'

export default function CreateRoom() {
  const router = useRouter()
  const [canSubmit, setCanSubmit] = useState(false)
  const [formData, setFormData] = useState({
    adminPassword: '',
    name: '',
    password: ''
  })
  const [messageProps, setMessageProps] = useState<{
    message: string
    type: MessageType
  }>({
    message: '',
    type: 'information'
  })

  useDeepCompareEffect(() => {
    setCanSubmit(isObjectFulfilled(formData))
  }, [formData])

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
    const roomDoc = db.collection('rooms').doc(roomName)
    const roomData = await roomDoc.get()

    if (roomData.exists) {
      setMessageProps({
        message: 'Ya existe una sala con ese nombre.',
        type: 'error'
      })

      return
    }

    await roomDoc.set({
      ...formData,
      name: roomName,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
      id: uuid()
    })

    setMessageProps({
      message: 'Sala creada con éxito',
      type: 'success'
    })

    setTimeout(() => {
      router.push(`/sala/${roomName}/admin`)
    }, 1000)
  }

  return (
    <Fragment>
      <h2 className="font-medium text-xl text-center uppercase">Crear sala</h2>
      <form onSubmit={onSubmit}>
        <InputText
          id="name"
          label="Nombre *"
          onInputChange={onFieldChange}
          value={formData.name}
        />
        <InputText
          id="password"
          label="Contraseña *"
          onInputChange={onFieldChange}
          value={formData.password}
        />
        <InputText
          id="adminPassword"
          label="Contraseña de administrador *"
          onInputChange={onFieldChange}
          value={formData.adminPassword}
        />
        <div className="mt-8">
          <Button className="w-full" disabled={!canSubmit} type="submit">
            <FiSmile className="text-2xl" />
            <span className="ml-4">Listo</span>
          </Button>
        </div>
      </form>
      {messageProps.message && (
        <Message type={messageProps.type}>{messageProps.message}</Message>
      )}
    </Fragment>
  )
}