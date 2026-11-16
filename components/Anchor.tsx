import classnames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
  display?: 'block' | 'inline-block'
  href: string
  id: string
  /** `image` wraps a single image: no text styles, focus ring follows its corners. */
  variant?: 'text' | 'image'
}

export default function Anchor({
  children,
  display = 'inline-block',
  href,
  id,
  variant = 'text',
}: Props) {
  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={classnames(
        variant === 'image'
          ? ['cb-image-link', 'block']
          : [
              'cb-text-link',
              'focus:outline-none focus:shadow-outline font-medium text-blue-800 underline',
              display,
            ],
      )}
    >
      {children}
    </a>
  )
}
