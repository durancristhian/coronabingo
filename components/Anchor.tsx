import classnames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  display?: 'block' | 'inline-block'
  href: string
  id: string
}

export default function Anchor({
  children,
  display = 'inline-block',
  href,
  id,
}: Props) {
  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classnames([
        'focus:outline-none focus:shadow-outline font-medium text-blue-800 underline',
        display,
      ])}
    >
      {children}
    </a>
  )
}
