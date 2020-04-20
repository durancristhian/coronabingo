import classnames from 'classnames'
import React, { MouseEvent } from 'react'

interface Props {
  Icon?: Function
  imageURL?: string
  imageAlt?: string
  iconBgColor: string
  label: string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function ShareButton({
  Icon,
  imageURL,
  imageAlt,
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
      <div
        className={classnames([
          'rounded-full',
          iconBgColor,
          Icon ? 'p-4' : 'p-2',
        ])}
      >
        {Icon && <Icon className="m-auto text-2xl text-white" />}
        {imageURL && (
          <img src={imageURL} alt={imageAlt} className="h-10 w-10" />
        )}
      </div>
      <p className="mt-2 text-gray-600 text-xs md:text-sm">{label}</p>
    </button>
  )
}
