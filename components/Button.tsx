import classnames from 'classnames'
import React, { MouseEvent, ReactNode } from 'react'

const BUTTON_COLORS = {
  green: ['bg-green-300', 'focus:bg-green-500', 'text-green-800'],
  red: ['bg-red-300', 'focus:bg-red-500', 'text-red-800'],
  yellow: ['bg-yellow-300', 'focus:bg-yellow-500', 'text-yellow-800'],
}

interface Props {
  ariaLabel?: string
  children: ReactNode
  className?: string
  color?: 'green' | 'red' | 'yellow'
  disabled?: boolean
  id: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  type?: 'submit' | 'button'
}

export default function Button({
  ariaLabel,
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
      aria-label={ariaLabel}
      id={id}
      type={type}
      className={classnames([
        'font-medium h-12 px-4 py-2 rounded text-center uppercase',
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
