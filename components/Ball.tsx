import classnames from 'classnames'
import React from 'react'

interface Props {
  animate?: boolean
  color: 'yellow' | 'gray'
  number: number
  size?: number
}

export default function Ball({
  animate = false,
  color,
  number,
  size = 90,
}: Props) {
  return (
    <div className={classnames(['text-center', animate && 'appear'])}>
      <div
        className={classnames([
          'ball',
          color === 'yellow' && 'bg-yellow-500',
          color === 'gray' && 'bg-gray-400',
        ])}
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
