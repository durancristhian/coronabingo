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
        `bg-${color}-400 border-2 border-${color}-600 font-medium h-12 px-4 py-2 rounded text-center text-${color}-600 uppercase`,
        `focus:bg-${color}-500 focus:border-${color}-700 focus:outline-none focus:shadow-outline focus:text-${color}-700`,
        'duration-150 ease-in-out transition',
        'disabled:opacity-50',
        className
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
