import classnames from 'classnames'
import React, { FocusEvent } from 'react'

interface Props {
  disabled?: boolean
  hint?: string
  id: string
  label: string
  onFocus?: (ev: FocusEvent<HTMLTextAreaElement>) => void
  onChange?: (value: string) => void
  readonly?: boolean
  value: string
}

export default function InputTextarea({
  disabled,
  hint = '',
  id,
  label,
  onFocus,
  onChange,
  readonly,
  value,
}: Props) {
  return (
    <div className="my-4">
      <label htmlFor={id} className="flex flex-col">
        <span>{label}</span>
        <textarea
          rows={5}
          className={classnames([
            'border-2 border-gray-300 mt-1 p-2 resize-none rounded',
            'focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500',
            'duration-150 ease-in-out transition',
            readonly && 'bg-gray-200',
            'disabled:opacity-50',
          ])}
          id={id}
          value={value}
          onChange={event => onChange && onChange(event.target.value)}
          onFocus={event => onFocus && onFocus(event)}
          disabled={disabled}
        />
      </label>
      {hint && (
        <p className="italic mt-1 text-gray-800 text-xs md:text-sm">{hint}</p>
      )}
    </div>
  )
}
