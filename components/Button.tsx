import classnames from 'classnames'
import React, { MouseEvent, ReactNode } from 'react'
import { BUTTON_COLORS } from '~/utils/constants'

interface Props {
  children: ReactNode
  className?: string
  color?: 'green' | 'pink' | 'red' | 'yellow'
  disabled?: boolean
  id?: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  type?: 'submit' | 'button'
}

export default function Button({
  children,
  className,
  color = 'yellow',
  disabled,
  id,
  onClick,
  type = 'button',
}: Props) {
  return (
    <button
      id={id}
      type={type}
      className={classnames([
        'border-2 font-medium h-12 px-4 py-2 rounded text-center uppercase',
        'focus:outline-none focus:shadow-outline',
        'duration-150 ease-in-out transition',
        'disabled:opacity-50',
        className,
        [...BUTTON_COLORS[color]],
      ])}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="flex items-center justify-center w-full">
        {children}
      </span>
    </button>
  )
}
