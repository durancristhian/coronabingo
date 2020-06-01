import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  href: string
  id: string
}

export default function Anchor({ children, href, id }: Props) {
  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus:outline-none focus:shadow-outline font-medium inline-block text-blue-800 underline"
    >
      {children}
    </a>
  )
}
