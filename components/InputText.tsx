import classnames from 'classnames'
import React, { FocusEvent, ReactNode } from 'react'

interface Props {
  autoComplete?: string
  disabled?: boolean
  hint?: string | ReactNode
  id: string
  label: string
  onFocus?: (ev: FocusEvent<HTMLInputElement>) => void
  onChange?: (value: string) => void
  readonly?: boolean
  type?: string
  value: string
}

export default function InputText({
  autoComplete,
  disabled,
  hint = '',
  id,
  label,
  onFocus,
  onChange,
  readonly,
  type = 'text',
  value,
}: Props) {
  return (
    <div className="cb-field my-4">
      <label htmlFor={id} className="cb-field-label flex flex-col">
        <span className="cb-field-label-text">{label}</span>
        <input
          type={type}
          className={classnames([
            'cb-input',
            'border-2 border-gray-300 h-12 mt-1 p-2 rounded',
            'focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500',
            'duration-150 ease-in-out transition',
            readonly && 'cb-input--readonly bg-gray-200',
            'disabled:opacity-50',
          ])}
          id={id}
          value={value}
          onChange={event => onChange && onChange(event.target.value)}
          onFocus={event => onFocus && onFocus(event)}
          disabled={disabled}
          readOnly={readonly}
          autoComplete={autoComplete || 'off'}
        />
      </label>
      {hint && (
        <p className="cb-field-hint italic mt-1 text-gray-800 text-xs md:text-sm">
          {hint}
        </p>
      )}
    </div>
  )
}
