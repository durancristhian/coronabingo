import classnames from 'classnames'

interface IProps {
  animate: boolean
  color: string
  number: number
  size?: number
}

export default function Ball({ animate, color, number, size = 90 }: IProps) {
  return (
    <div className={classnames(['text-center', animate && 'appear'])}>
      <div
        className={`ball ${color}`}
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
