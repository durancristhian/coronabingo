interface IProps {
  color: string
  meaning?: string
  number: number
  size?: number
}

export default function Ball({ color, number, meaning, size = 90 }: IProps) {
  return (
    <div className="text-center">
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
      {meaning && <p className="font-medium mt-2 text-sm">{meaning}</p>}
    </div>
  )
}
