import classnames from 'classnames'
import React, { Fragment } from 'react'

interface Props {
  disabled?: boolean
  hint?: string
  id: string
  label: string
  onChange: (value: boolean) => void
  value: boolean
}

export default function Checkbox({
  disabled,
  hint = '',
  id,
  label,
  onChange,
  value,
}: Props) {
  return (
    <Fragment>
      <label htmlFor={id} className="cursor-pointer flex items-center">
        <input
          className={classnames([
            'block p-2',
            'focus:outline-none focus:shadow-outline',
            'duration-150 ease-in-out transition',
            'disabled:opacity-50',
          ])}
          type="checkbox"
          id={id}
          defaultChecked={value}
          onChange={event => onChange && onChange(event.target.checked)}
          disabled={disabled}
        />
        <span className="flex-auto pl-4 py-2">{label}</span>
      </label>
      {hint && <p className="italic mt-2 text-gray-800 md:text-sm">{hint}</p>}
    </Fragment>
  )
}
