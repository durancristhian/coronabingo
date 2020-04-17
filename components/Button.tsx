import classnames from 'classnames'
import React, { MouseEvent, ReactNode } from 'react'

const BUTTON_COLORS = {
  gray: [
    'bg-gray-200',
    'border-gray-600',
    'focus:bg-gray-300',
    'focus:border-gray-700',
    'focus:text-gray-900',
    'text-gray-800',
  ],
  green: [
    'bg-green-200',
    'border-green-600',
    'focus:bg-green-300',
    'focus:border-green-700',
    'focus:text-green-900',
    'text-green-800',
  ],
  pink: [
    'bg-pink-200',
    'border-pink-600',
    'focus:bg-pink-300',
    'focus:border-pink-700',
    'focus:text-pink-900',
    'text-pink-800',
  ],
  red: [
    'bg-red-200',
    'border-red-600',
    'focus:bg-red-300',
    'focus:border-red-700',
    'focus:text-red-900',
    'text-red-800',
  ],
  yellow: [
    'bg-yellow-200',
    'border-yellow-600',
    'focus:bg-yellow-300',
    'focus:border-yellow-700',
    'focus:text-yellow-900',
    'text-yellow-800',
  ],
}

interface Props {
  ariaLabel?: string
  children: ReactNode
  className?: string
  color?: 'gray' | 'green' | 'pink' | 'red' | 'yellow'
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
