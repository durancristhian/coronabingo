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

const ALIGNMENT = {
  center: 'text-center',
  left: 'text-left',
  right: 'text-right',
}

interface Props {
  children: ReactNode
  textAlign?: 'left' | 'center' | 'right'
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function Heading({
  children,
  textAlign = 'left',
  type = 'h1',
}: Props) {
  const Type = type

  const className = classnames([
    'font-medium',
    ...HEADER_STYLES[type],
    ALIGNMENT[textAlign],
  ])

  return <Type className={className}>{children}</Type>
}
