import classnames from 'classnames'
import { IPlayer } from './Players'

interface IProps {
  disabled?: boolean
  id: string
  label: string
  onChange?: (value: string) => void
  options: IPlayer[]
  value: string
}

export default function Select({
  disabled = false,
  id,
  label,
  onChange,
  options,
  value
}: IProps) {
  return (
    <label htmlFor={id} className="flex flex-col my-4">
      <span>{label}</span>
      <select
        id={id}
        className={classnames([
          'border-2 border-gray-300 h-12 mt-1 p-2 rounded',
          'focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500',
          'duration-150 ease-in-out transition',
          'disabled:opacity-50'
        ])}
        value={value}
        onChange={event => onChange && onChange(event.target.value)}
        disabled={disabled}
      >
        {!value && <option value={''}>--- Selecciona ---</option>}
        {options.map(opt => (
          <option key={opt.name} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </label>
  )
}
