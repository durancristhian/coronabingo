import classnames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  size?: 'small' | 'medium' | 'large'
}

const CONTAINER_SIZES = {
  small: ['md:w-6/12', 'lg:w-2/5'],
  medium: ['md:w-8/12', 'lg:w-3/5'],
  large: ['w-full'],
}

export default function Container({ children, size = 'small' }: Props) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className={classnames(['mx-auto', [...CONTAINER_SIZES[size]]])}>
        {children}
      </div>
    </div>
  )
}
