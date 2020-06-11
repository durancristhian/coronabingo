import React, { ReactNode } from 'react'
import { useFriction } from 'renature'

interface Props {
  children: ReactNode
}

export default function Pelotita({ children }: Props) {
  const [props] = useFriction({
    from: {
      opacity: 0,
      /* 360 * 3 = 1080 */
      transform: 'rotate(1080deg) scale(0)',
    },
    to: {
      opacity: 1,
      transform: 'rotate(0deg) scale(1)',
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
