import classnames from 'classnames'

interface IProps {
  id: string
  label: string
  onChange: (value: boolean) => void
  value: boolean
}

export default function Checkbox({ id, label, onChange, value }: IProps) {
  return (
    <label htmlFor={id} className="cursor-pointer flex items-center">
      <input
        className={classnames([
          'block p-2',
          'focus:outline-none focus:shadow-outline',
          'duration-150 ease-in-out transition'
        ])}
        type="checkbox"
        id={id}
        checked={value}
        onChange={event => onChange && onChange(event.target.checked)}
      />
      <span className="flex-auto pl-4 py-2">{label}</span>
    </label>
  )
}
