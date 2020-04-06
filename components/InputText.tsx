import classnames from 'classnames'
import { FocusEvent } from 'react'

interface IProps {
  hint?: string
  id: string
  label: string
  onFocus?: (ev: FocusEvent<HTMLInputElement>) => void
  onChange?: (value: string) => void
  readonly?: boolean
  value: string
}

export default function InputText({
  hint = '',
  id,
  label,
  onFocus,
  onChange,
  readonly,
  value
}: IProps) {
  return (
    <div className="my-4">
      <label htmlFor={id} className="flex flex-col">
        <span>{label}</span>
        <input
          type="text"
          className={classnames([
            'border-2 border-gray-300 h-12 mt-1 p-2 rounded',
            'focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500',
            'duration-150 ease-in-out transition',
            readonly && 'bg-gray-200'
          ])}
          id={id}
          value={value}
          onChange={event => onChange && onChange(event.target.value)}
          onFocus={event => onFocus && onFocus(event)}
        />
      </label>
      {hint && (
        <p className="italic mt-1 text-gray-600 text-xs md:text-sm">{hint}</p>
      )}
    </div>
  )
}
