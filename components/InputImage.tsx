import classnames from 'classnames'
import React, { Fragment } from 'react'
import { FiMinus, FiUpload } from 'react-icons/fi'
import Button from './Button'

interface Props {
  id: string
  image: string
  label: string
  onChange: (content: string, extension: string) => void
}

export default function InputImage({ label, id, image, onChange }: Props) {
  const labelRef = React.createRef<HTMLLabelElement>()
  const inputRef = React.createRef<HTMLInputElement>()
  const clearImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault()

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    onChange('', '')
  }
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const file = target.files ? target.files[0] : undefined

    if (file) {
      const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
      const reader = new FileReader()

      reader.onloadend = () => {
        if (reader.result) {
          onChange(reader.result.toString(), fileExtension)
        }
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <Fragment>
      <label htmlFor={id} className="flex flex-col my-4" ref={labelRef}>
        <span>{label}</span>
        {!image && (
          <div className="mt-1">
            <Button
              aria-label="Agregar imágen"
              id="add-image"
              onClick={() => labelRef.current?.click()}
              iconLeft={<FiUpload />}
            >
              Agregar imágen
            </Button>
          </div>
        )}
        {image && (
          <div className="flex justify-center mt-4">
            <div className="h-64 mx-auto relative">
              <img
                src={image}
                alt="Previsualización"
                className="border-2 border-gray-300 h-full rounded"
              />
              <button
                className={classnames([
                  'absolute bg-black border-2 border-gray-300 -mr-2 -mt-2 rounded-full p-2 right-0 top-0',
                  'focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500',
                ])}
                onClick={clearImage}
              >
                <FiMinus color="white" />
              </button>
            </div>
          </div>
        )}
      </label>
      <input
        accept="image/*"
        className="visually-hidden"
        id={id}
        onChange={handleOnChange}
        tabIndex={-1}
        type="file"
        ref={inputRef}
      />
    </Fragment>
  )
}
