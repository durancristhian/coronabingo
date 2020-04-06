import classnames from 'classnames'
import { ReactNode } from 'react'

interface IProps {
  children: ReactNode
  type?: BannerType
}

export default function Banner({ children, type = 'information' }: IProps) {
  return (
    <div
      className={classnames([
        'px-4 py-2',
        type === 'information' && 'bg-yellow-200',
        type === 'emphasis' && 'bg-purple-200',
        type === 'error' && 'bg-red-200'
      ])}
    >
      <div className="max-w-4xl mx-auto">
        <div className="leading-normal text-center">{children}</div>
      </div>
    </div>
  )
}

type BannerType = 'information' | 'emphasis' | 'error'
