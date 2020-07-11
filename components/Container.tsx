import classnames from 'classnames'
import React, { ReactNode } from 'react'
import { CONTAINER_SIZES } from '~/utils'

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
