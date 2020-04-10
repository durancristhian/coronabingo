import classnames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  size?: 'small' | 'large'
}

const CONTAINER_SIZES = {
  small: 'md:w-2/4',
  large: 'w-full',
}

export default function Container({ children, size = 'small' }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className={classnames(['mx-auto', CONTAINER_SIZES[size]])}>
        {children}
      </div>
    </div>
  )
}
