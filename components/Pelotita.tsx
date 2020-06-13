import React, { ReactNode } from 'react'
import { useFriction } from 'renature'

interface Props {
  children: ReactNode
  index: number
}

export default function Pelotita({ children, index }: Props) {
  const [props] = useFriction({
    from: {
      opacity: index === 0 ? 0 : 1,
      transform: `translateX(-50px) rotate(${index === 0 ? '-360deg' : '0'})`,
    },
    to: {
      opacity: 1,
      transform: 'translateX(0) rotate(0deg)',
    },
    config: {
      mu: 0.2,
      mass: 20,
      initialVelocity: 2,
    },
  })

  return (
    <div className="live-preview__mover live-preview__mover--lg" {...props}>
      {children}
    </div>
  )
}
