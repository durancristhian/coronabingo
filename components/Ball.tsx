import classnames from 'classnames'
import React from 'react'
import Pelotita from './Pelotita'

interface Props {
  bgColor: string
  index: number
  number: number
  size?: number
}

export default function Ball({ bgColor, index, number, size = 90 }: Props) {
  return (
    <Pelotita index={index}>
      <div className={classnames(['text-center'])}>
        <div
          className={classnames(['ball', bgColor])}
          style={{
            height: `${size}px`,
            width: `${size}px`,
          }}
        >
          <div>
            <span
              data-test-class="ball"
              className="font-medium"
              style={{ fontSize: `${size / 3}px` }}
            >
              {number}
            </span>
          </div>
        </div>
      </div>
    </Pelotita>
  )
}
