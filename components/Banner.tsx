import classnames from 'classnames'
import React, { ReactNode } from 'react'
import { BannerType } from '~/interfaces'

interface Props {
  children: ReactNode
  type?: BannerType
}

export default function Banner({ children, type = 'information' }: Props) {
  return (
    <div
      className={classnames([
        'px-4 py-2',
        type === 'information' && 'bg-yellow-200',
        type === 'emphasis' && 'bg-purple-200',
        type === 'error' && 'bg-red-200',
      ])}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  )
}
