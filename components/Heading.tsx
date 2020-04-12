import React, { ReactNode } from 'react'
import classnames from 'classnames'

const HEADER_STYLES = {
  h1: ['text-xl', 'md:text-2xl'],
  h2: ['text-lg', 'md:text-xl', 'mb-4'],
  h3: [],
  h4: [],
}

interface Props {
  children: ReactNode
  type?: 'h1' | 'h2' | 'h3' | 'h4'
  textCenter?: boolean
}

export default function Heading({
  children,
  type = 'h1',
  textCenter = true,
}: Props) {
  const Type = type

  const className = classnames([
    'font-medium',
    textCenter ? 'text-center' : null,
    ...HEADER_STYLES[type],
  ])

  return <Type className={className}>{children}</Type>
}
