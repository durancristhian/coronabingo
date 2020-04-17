import classnames from 'classnames'
import React, { MouseEvent } from 'react'

interface Props {
  Icon: Function
  iconBgColor: string
  label: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function ShareButton({
  Icon,
  iconBgColor,
  label,
  onClick,
}: Props) {
  return (
    <button
      className={classnames([
        'flex flex-col items-center justify-center mx-2 p-1 outline-none rounded text-center',
        'focus:outline-none focus:shadow-outline',
        'duration-150 ease-in-out transition',
      ])}
      onClick={onClick}
    >
      <div className={classnames(['p-4 rounded-full', iconBgColor])}>
        <Icon className="m-auto text-2xl md:text-3xl text-white" />
      </div>
      <p className="mt-2 text-gray-600 text-xs md:text-sm">{label}</p>
    </button>
  )
}
