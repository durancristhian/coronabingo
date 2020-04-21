import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  href?: string
}

export default function Anchor({ children, href }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus:outline-none focus:shadow-outline font-medium text-blue-800 underline"
    >
      {children}
    </a>
  )
}
