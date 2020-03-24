import { FiCheckSquare, FiSquare } from 'react-icons/fi'

interface IProps {
  id: string
  label: string
  onInputChange: (id: string, value: boolean) => void
  value: boolean
}

export default function Checkbox({ id, label, onInputChange, value }: IProps) {
  return (
    <label htmlFor={id} className="flex items-center my-4">
      <button
        id={id}
        className="focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500 mr-4 text-2xl"
        onClick={() => onInputChange(id, !value)}
      >
        {value ? <FiCheckSquare className="text-blue-600" /> : <FiSquare />}
      </button>
      <span>{label}</span>
    </label>
  )
}
