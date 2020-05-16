import classnames from 'classnames'
import React, { useContext } from 'react'
import { BackgroundCellContext } from '~/contexts/BackgroundCell'

export const COLORS: { [k: string]: string } = {
  blue: 'bg-blue-300',
  green: 'bg-green-300',
  indigo: 'bg-indigo-300',
  orange: 'bg-orange-300',
  pink: 'bg-pink-300',
  purple: 'bg-purple-300',
  teal: 'bg-teal-300',
  yellow: 'bg-yellow-300',
}

export default function EmptyCell({ index }: { index: number }) {
  const {
    backgroundCell: { type, value },
  } = useContext(BackgroundCellContext)

  const randomValue = Array.isArray(value)
    ? value[Math.abs(Math.floor(value.length * ((index / value.length) % 1)))]
    : value

  return (
    <div
      className={classnames([
        'bg-center bg-contain bg-gray-200 bg-no-repeat border-b-2 border-r-2 border-gray-900 flex h-8 sm:h-20 items-center justify-center p-1 relative w-1/10',
        type === 'color' && COLORS[randomValue],
      ])}
      style={{
        ...(type === 'img' && {
          backgroundImage: `url(/background-cells/${randomValue})`,
        }),
        ...(type === 'url' && {
          backgroundImage: `url(${randomValue})`,
        }),
      }}
    ></div>
  )
}
