import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function Box({ children, className = '' }: Props) {
  return (
    <div className={`cb-box bg-white p-4 rounded shadow ${className}`}>
      {children}
    </div>
  )
}
