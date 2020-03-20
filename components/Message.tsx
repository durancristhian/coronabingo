import classnames from 'classnames'
import React, { ReactNode } from 'react'
import { FiInfo, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'

export interface IMessage {
  children: ReactNode
  type: MessageType
}

export default function Message({ children, type }: IMessage) {
  return (
    <div
      className={classnames(['border-l-2 flex items-center p-4', COLORS[type]])}
    >
      <div className="mr-4">{ICONS[type]}</div>
      {children}
    </div>
  )
}

const ICONS = {
  error: <FiThumbsDown />,
  information: <FiInfo />,
  success: <FiThumbsUp />
}

const COLORS = {
  error: 'bg-red-200 border-red-600',
  information: 'bg-orange-200 border-orange-600',
  success: 'bg-green-200 border-green-600'
}

export type MessageType = 'error' | 'information' | 'success'
