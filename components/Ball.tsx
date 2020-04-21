import classnames from 'classnames'
import React from 'react'

interface Props {
  animate?: boolean
  bgColor: string
  number: number
  size?: number
}

export default function Ball({
  animate = false,
  bgColor,
  number,
  size = 90,
}: Props) {
  return (
    <div className={classnames(['text-center', animate && 'appear'])}>
      <div
        className={classnames(['ball', bgColor])}
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      >
        <div>
          <span className="font-medium" style={{ fontSize: `${size / 3}px` }}>
            {number}
          </span>
        </div>
      </div>
    </div>
  )
}
