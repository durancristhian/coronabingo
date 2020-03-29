import { ReactNode } from 'react'
import { BOARD_NUMBER_COLOR } from '~/utils/constants'

interface IProps {
  children: ReactNode
  meaning?: string
  size?: number
}

export default function Ball({ children, meaning, size = 90 }: IProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div
          className={`ball ${BOARD_NUMBER_COLOR[Number(children)]}`}
          style={{
            height: `${size}px`,
            width: `${size}px`
          }}
        >
          <div>
            <span className="font-oswald" style={{ fontSize: `${size / 3}px` }}>
              {children}
            </span>
          </div>
        </div>
      </div>
      {meaning && <p className="font-medium ml-8 text-gray-600">{meaning}</p>}
    </div>
  )
}
