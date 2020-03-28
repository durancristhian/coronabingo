import classnames from 'classnames'
import { IPlayer } from './Players'

interface IProps {
  disabled?: boolean
  id: string
  label: string
  onInputChange?: (id: string, value: string) => void
  options: IPlayer[]
  value: string
}

export default function Select({
  disabled = false,
  id,
  label,
  onInputChange,
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
          'disabled:opacity-50'
        ])}
        value={value}
        onChange={event =>
          onInputChange && onInputChange(id, event.target.value)
        }
        disabled={disabled}
      >
        {!value && <option value={''}>--- Selecciona ---</option>}
        {options.map(opt => (
          <option key={opt.name} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </label>
  )
}
