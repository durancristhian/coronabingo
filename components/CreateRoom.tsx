import { useRouter } from 'next/router'
import { FormEvent, Fragment, useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import useDeepCompareEffect from 'use-deep-compare-effect'
import db from '../utils/firebase'
import isObjectFulfilled from '../utils/isObjectFulfilled'
import Button from './Button'
import InputText from './InputText'
import firebase from 'firebase'

export default function CreateRoom() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    adminPassword: '',
    name: '',
    password: ''
  })
  const [canSubmit, setCanSubmit] = useState(false)

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

    const { name } = formData

    const roomDoc = db.collection('rooms').doc(name)
    const roomData = await roomDoc.get()

    if (roomData.exists) {
      /* TODO: show an because the room already exist */

      return
    }

    await roomDoc.set({
      ...formData,
      date: firebase.database.ServerValue.TIMESTAMP
    })

    router.push(`/sala/${name}/admin`)
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
    </Fragment>
  )
}
