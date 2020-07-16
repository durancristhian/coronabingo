import classnames from 'classnames'
import React, { ReactNode } from 'react'

const CONTAINER_SIZES = {
  medium: ['md:w-8/12', 'lg:w-3/5'],
  large: ['w-full'],
}

interface Props {
  children: ReactNode
  size?: 'medium' | 'large'
}

export default function Container({ children, size = 'medium' }: Props) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className={classnames(['mx-auto', [...CONTAINER_SIZES[size]]])}>
        {children}
      </div>
    </div>
  )
}
