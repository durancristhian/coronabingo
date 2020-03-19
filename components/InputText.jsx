import classnames from 'classnames'

export default function InputText({
  id,
  label,
  onChange,
  readonly,
  value,
  ...rest
}) {
  return (
    <label htmlFor={id} className="flex flex-col my-4">
      <span>{label}</span>
      <input
        type="text"
        className={classnames([
          'border-2 border-gray-300 h-12 mt-1 p-2 rounded',
          'focus:border-gray-600 focus:outline-none focus:shadow-outline hover:border-gray-500',
          readonly && 'bg-gray-200'
        ])}
        id={id}
        value={value}
        onChange={event => onChange && onChange(id, event.target.value)}
        {...rest}
      />
    </label>
  )
}
