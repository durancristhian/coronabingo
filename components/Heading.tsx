import classnames from 'classnames'
import React, { ReactNode } from 'react'

const HEADER_STYLES = {
  h1: ['text-xl', 'md:text-2xl'],
  h2: ['text-lg', 'md:text-xl'],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
}

interface Props {
  children: ReactNode
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function Heading({ children, type = 'h1' }: Props) {
  const Type = type

  const className = classnames(['font-medium', ...HEADER_STYLES[type]])

  return <Type className={className}>{children}</Type>
}
