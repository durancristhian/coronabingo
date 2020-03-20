import classnames from 'classnames'
import { ChangeEvent, ReactNode } from 'react'

interface IProps {
  children: ReactNode
  className?: string
  color?: 'gray' | 'green' | 'red' | 'yellow'
  disabled?: boolean
  id?: string
  onButtonClick?: (id: string, value: string) => void
  type?: 'submit' | 'button'
}

export default function Button({
  children,
  className,
  color = 'yellow',
  disabled,
  id,
  onButtonClick,
  type = 'button'
}: IProps) {
  return (
    <button
      type={type}
      className={classnames([
        `border-2 font-medium h-12 px-4 py-2 rounded text-center uppercase`,
        `focus:outline-none focus:shadow-outline`,
        'duration-150 ease-in-out transition',
        'disabled:opacity-50',
        className,
        [...COLORS[color]]
      ])}
      disabled={disabled}
      onClick={event =>
        id &&
        onButtonClick &&
        onButtonClick(id, (event.target as HTMLInputElement).value)
      }
    >
      <span className="flex items-center justify-center w-full">
        {children}
      </span>
    </button>
  )
}

const COLORS = {
  gray: [
    `bg-gray-400`,
    `border-gray-600`,
    `focus:bg-gray-500`,
    `focus:border-gray-700`,
    `focus:text-gray-700`,
    `text-gray-600`
  ],
  green: [
    `bg-green-400`,
    `border-green-600`,
    `focus:bg-green-500`,
    `focus:border-green-700`,
    `focus:text-green-700`,
    `text-green-600`
  ],
  red: [
    `bg-red-400`,
    `border-red-600`,
    `focus:bg-red-500`,
    `focus:border-red-700`,
    `focus:text-red-700`,
    `text-red-600`
  ],
  yellow: [
    `bg-yellow-400`,
    `border-yellow-600`,
    `focus:bg-yellow-500`,
    `focus:border-yellow-700`,
    `focus:text-yellow-700`,
    `text-yellow-600`
  ]
}
