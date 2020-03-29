import classnames from 'classnames'

interface IProps {
  animate: boolean
  color: string
  meaning?: string
  number: number
  size?: number
}

export default function Ball({
  animate,
  color,
  number,
  meaning,
  size = 90
}: IProps) {
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
      {meaning && (
        <p className="font-medium leading-normal mt-2 text-sm">{meaning}</p>
      )}
    </div>
  )
}
