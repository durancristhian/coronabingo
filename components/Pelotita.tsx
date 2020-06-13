import React, { ReactNode } from 'react'
import { useFriction } from 'renature'

interface Props {
  children: ReactNode
  index: number
}

const yellow = 'rgb(236, 201, 75)'
const gray = 'rgb(203, 213, 224)'

export default function Pelotita({ children, index }: Props) {
  const [props] = useFriction({
    from: {
      backgroundColor: index > 1 ? gray : yellow,
      opacity: index === 0 ? 0 : 1,
      transform: `translateX(-50px) rotate(${
        index === 0 ? '-360deg' : '0'
      }) scale(${index > 1 ? 0.75 : 1})`,
    },
    to: {
      backgroundColor: index > 0 ? gray : yellow,
      opacity: 1,
      transform: `translateX(${index === 0 ? 0 : '10px'}) rotate(0deg) scale(${
        index === 0 ? 1 : 0.75
      })`,
    },
    config: {
      mu: 0.2,
      mass: 20,
      initialVelocity: 2,
    },
  })

  return (
    <div
      className="live-preview__mover live-preview__mover--lg rounded-full"
      {...props}
    >
      {children}
    </div>
  )
}
