import classnames from 'classnames'
import React, { Fragment } from 'react'
import Pelotita from './Pelotita'

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
  const Wrapper = animate ? Pelotita : Fragment

  return (
    <Wrapper>
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
    </Wrapper>
  )
}
