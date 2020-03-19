import classnames from 'classnames'

export default function Button({
  children,
  className = null,
  color = 'yellow',
  disabled = false,
  type,
  ...rest
}) {
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
      {...rest}
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
    `text-gray-600`,
    `focus:bg-gray-500`,
    `focus:border-gray-700`,
    `focus:text-gray-700`
  ],
  green: [
    `bg-green-400`,
    `border-green-600`,
    `text-green-600`,
    `focus:bg-green-500`,
    `focus:border-green-700`,
    `focus:text-green-700`
  ],
  red: [
    `bg-red-400`,
    `border-red-600`,
    `text-red-600`,
    `focus:bg-red-500`,
    `focus:border-red-700`,
    `focus:text-red-700`
  ],
  yellow: [
    `bg-yellow-400`,
    `border-yellow-600`,
    `text-yellow-600`,
    `focus:bg-yellow-500`,
    `focus:border-yellow-700`,
    `focus:text-yellow-700`
  ]
}
