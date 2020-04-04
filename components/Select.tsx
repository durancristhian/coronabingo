import classnames from 'classnames'
import { Fragment } from 'react'

interface IProps {
  disabled?: boolean
  hint?: string
  id: string
  label?: string
  onChange?: (value: string) => void
  options: IOption[]
  value: string
}

export default function Select({
  disabled = false,
  hint = '',
  id,
  label,
  onChange,
  options,
  value
}: IProps) {
  return (
    <Fragment>
      <label htmlFor={id} className="flex flex-col">
        {label && <span className="mb-1">{label}</span>}
        <select
          id={id}
          className={classnames([
            'border-2 border-gray-300 h-12 p-2 rounded',
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
      {hint && (
        <p className="italic leading-normal mt-1 text-gray-600 text-sm">
          {hint}
        </p>
      )}
    </Fragment>
  )
}

interface IOption {
  id: string
  name: string
}
