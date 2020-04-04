import firebase from 'firebase'
// @ts-ignore
import Router from 'next-translate/Router'
// @ts-ignore
import useTranslation from 'next-translate/useTranslation'
import { FormEvent, Fragment, useEffect, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
// @ts-ignore
import urlSlug from 'url-slug'
import { roomsRef } from '~/utils/firebase'
import isObjectFulfilled from '~/utils/isObjectFulfilled'
import Button from './Button'
import InputText from './InputText'
import Message, { MessageType } from './Message'

export default function CreateRoom() {
  const { t } = useTranslation()
  const [canSubmit, setCanSubmit] = useState(false)
  const [formData, setFormData] = useState({
    name: ''
  })
  const [messageProps, setMessageProps] = useState<{
    message: string
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
      message: t('index:create-room.saving'),
      type: 'information'
    })

    const { name } = formData
    const roomName = urlSlug(name)
    const roomDoc = roomsRef.doc(roomName)
    const roomData = await roomDoc.get()

    if (roomData.exists) {
      setMessageProps({
        message: t('index:create-room.already-exist'),
        type: 'error'
      })

      return
    }

    await roomDoc.set({
      ...formData,
      name: roomName,
      date: firebase.firestore.Timestamp.fromDate(new Date())
    })

    setMessageProps({
      message: t('index:create-room.success'),
      type: 'success'
    })

    setTimeout(() => {
      Router.pushI18n('/sala/[name]/admin', `/sala/${roomName}/admin`)
    }, 1000)
  }

  return (
    <Fragment>
      <h2 className="font-medium text-xl text-center uppercase">
        {t('index:create-room.title')}
      </h2>
      <form onSubmit={onSubmit}>
        <InputText
          id="name"
          label={t('index:create-room.field-name')}
          onChange={value => onFieldChange('name', value)}
          value={formData.name}
        />
        <div className="mt-8">
          <Button className="w-full" disabled={!canSubmit} type="submit">
            <FiSmile />
            <span className="ml-4">{t('index:create-room.field-submit')}</span>
          </Button>
        </div>
      </form>
      {messageProps.message && (
        <Message type={messageProps.type}>{messageProps.message}</Message>
      )}
    </Fragment>
  )
}
