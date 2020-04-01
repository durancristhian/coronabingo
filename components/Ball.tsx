import classnames from 'classnames'

interface IProps {
  animate?: boolean
  color: string
  number: number
  size?: number
}

export default function Ball({
  animate = false,
  color,
  number,
  size = 90
}: IProps) {
  return (
    <div className={classnames(['text-center', animate && 'appear'])}>
      <div
        className={classnames([
          'ball',
          color === 'blue' && 'bg-blue-600',
          color === 'green' && 'bg-green-600',
          color === 'red' && 'bg-red-600',
          color === 'yellow' && 'bg-yellow-600'
        ])}
        style={{
          height: `${size}px`,
          width: `${size}px`
        }}
      >
        <div>
          <span
            className="font-medium font-oswald"
            style={{ fontSize: `${size / 3}px` }}
          >
            {number}
          </span>
        </div>
      </div>
    </div>
  )
}
