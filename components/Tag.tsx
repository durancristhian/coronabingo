import classnames from 'classnames'
import React, { ReactNode } from 'react'

const COLORS = {
  green: ['bg-green-300', 'text-green-800'],
  yellow: ['bg-yellow-300', 'text-yellow-800'],
}

interface Props {
  children: ReactNode
  color: 'yellow' | 'green'
}

export default function Tag({ children, color }: Props) {
  return (
    <div
      className={classnames(['inline-block px-2 rounded', ...COLORS[color]])}
    >
      {children}
    </div>
  )
}
