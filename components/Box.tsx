import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function Box({ children }: Props) {
  return <div className="bg-white p-4 rounded shadow">{children}</div>
}
