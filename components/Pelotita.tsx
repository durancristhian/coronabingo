import React, { ReactNode, useEffect, useRef } from 'react'

interface Props {
  children: ReactNode
  index: number
}

const yellow = 'rgb(236, 201, 75)'
const gray = 'rgb(203, 213, 224)'

function getStyle(index: number) {
  return {
    backgroundColor: index > 0 ? gray : yellow,
    opacity: 1,
    transform: `translateX(${index === 0 ? 0 : '10px'}) rotate(0deg) scale(${
      index === 0 ? 1 : 0.75
    })`,
  }
}

export default function Pelotita({ children, index }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const style = getStyle(index)

  useEffect(() => {
    const element = ref.current
    if (!element || !element.animate) return

    const from = {
      backgroundColor: index > 1 ? gray : yellow,
      opacity: index === 0 ? 0 : 1,
      transform: `translateX(-50px) rotate(${
        index === 0 ? '-360deg' : '0'
      }) scale(${index > 1 ? 0.75 : 1})`,
    }
    const animation = element.animate([from, getStyle(index)], {
      // renature friction: stopping time = initialVelocity / (mu * gravity).
      duration: (2 / (0.2 * 9.80665)) * 1000,
      // Constant deceleration follows 2t - t².
      easing: 'cubic-bezier(0.333333, 0.666667, 0.666667, 1)',
    })

    return () => animation.cancel()
  }, [index])

  return (
    <div
      className="live-preview__mover live-preview__mover--lg rounded-full"
      ref={ref}
      style={style}
    >
      {children}
    </div>
  )
}
