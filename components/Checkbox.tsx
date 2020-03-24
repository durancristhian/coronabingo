import { createRef } from 'react'
import { FiCheckSquare, FiSquare } from 'react-icons/fi'

interface IProps {
  id: string
  label: string
  onInputChange: (id: string, value: boolean) => void
  value: boolean
}

export default function Checkbox({ id, label, onInputChange, value }: IProps) {
  return (
    <label className="cursor-pointer flex items-center">
      <span
        className="focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500 text-2xl"
        /* onClick={() => onInputChange(id, !value)} */
      >
        {value ? (
          <FiCheckSquare
            onClick={() => onInputChange(id, !value)}
            className="text-blue-600"
          />
        ) : (
          <FiSquare onClick={() => onInputChange(id, !value)} />
        )}
      </span>
      <span
        className="flex-auto pl-4 py-2"
        onClick={() => onInputChange(id, !value)}
      >
        {label}
      </span>
    </label>
  )
}
