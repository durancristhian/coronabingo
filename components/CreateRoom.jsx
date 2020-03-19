import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiSmile } from 'react-icons/fi'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Button from '../components/Button'
import InputText from '../components/InputText'
import db from '../firebase'
import isObjectFulfilled from '../utils/isObjectFulfilled'

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

  const onFieldChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    })
  }

  const onSubmit = async event => {
    event.preventDefault()

    const { name } = formData

    /* TODO: Add validations */
    await db
      .collection('rooms')
      .doc(name)
      .set({ ...formData, date: new Date().toJSON() })

    router.push(`/sala/${formData.name}/admin`)
  }

  return (
    <>
      <h2 className="font-medium text-xl text-center uppercase">Crear sala</h2>
      <form onSubmit={onSubmit}>
        <InputText
          id="name"
          label="Nombre *"
          onChange={onFieldChange}
          value={formData.name}
        />
        <InputText
          id="password"
          label="Contraseña *"
          onChange={onFieldChange}
          value={formData.password}
        />
        <InputText
          id="adminPassword"
          label="Contraseña de administrador *"
          onChange={onFieldChange}
          value={formData.adminPassword}
        />
        <div className="mt-8">
          <Button className="w-full" disabled={!canSubmit} type="submit">
            <FiSmile className="text-2xl" />
            <span className="ml-4">Listo</span>
          </Button>
        </div>
      </form>
    </>
  )
}
