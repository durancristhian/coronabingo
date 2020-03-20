import classnames from 'classnames'
import { FocusEvent } from 'react'

interface IProps {
  id: string
  label: string
  onFocus?: (ev: FocusEvent<HTMLInputElement>) => void
  onInputChange?: (id: string, value: string) => void
  readonly?: boolean
  value: string
}

export default function InputText({
  id,
  label,
  onFocus,
  onInputChange,
  readonly,
  value
}: IProps) {
  return (
    <label htmlFor={id} className="flex flex-col my-4">
      <span>{label}</span>
      <input
        type="text"
        className={classnames([
          'border-2 border-gray-300 h-12 mt-1 p-2 rounded',
          'focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500',
          readonly && 'bg-gray-200'
        ])}
        id={id}
        value={value}
        onChange={event =>
          onInputChange && onInputChange(id, event.target.value)
        }
        onFocus={event => onFocus && onFocus(event)}
      />
    </label>
  )
}
