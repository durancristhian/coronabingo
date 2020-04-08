import classnames from 'classnames'
import React, { MouseEvent, ReactNode } from 'react'

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
        [...COLORS[color]],
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

const COLORS = {
  green: [
    'bg-green-400',
    'border-green-600',
    'focus:bg-green-500',
    'focus:border-green-700',
    'focus:text-green-900',
    'text-green-800',
  ],
  pink: [
    'bg-pink-400',
    'border-pink-600',
    'focus:bg-pink-500',
    'focus:border-pink-700',
    'focus:text-pink-900',
    'text-pink-800',
  ],
  red: [
    'bg-red-400',
    'border-red-600',
    'focus:bg-red-500',
    'focus:border-red-700',
    'focus:text-red-900',
    'text-red-800',
  ],
  yellow: [
    'bg-yellow-400',
    'border-yellow-600',
    'focus:bg-yellow-500',
    'focus:border-yellow-700',
    'focus:text-yellow-900',
    'text-yellow-800',
  ],
}
