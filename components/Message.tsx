import classnames from 'classnames'
import React, { ReactNode } from 'react'
import { FiInfo, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'
import { MessageType } from '~/interfaces/custom/Message'

const ICONS = {
  error: <FiThumbsDown />,
  information: <FiInfo />,
  success: <FiThumbsUp />,
}

const COLORS = {
  error: 'bg-red-200 border-red-600',
  information: 'bg-orange-200 border-orange-600',
  success: 'bg-green-200 border-green-600',
}

const ICON_COLORS = {
  error: 'cb-message-icon--error',
  information: 'cb-message-icon--information',
  success: 'cb-message-icon--success',
}

export interface Props {
  children: ReactNode
  icon?: ReactNode
  type: MessageType
}

export default function Message({ children, icon, type }: Props) {
  return (
    <div
      className={classnames([
        'cb-message',
        `cb-message--${type}`,
        'border-l-2 flex items-center p-4',
        COLORS[type],
      ])}
    >
      <div
        aria-hidden="true"
        className={classnames(['cb-message-icon', ICON_COLORS[type], 'mr-4'])}
      >
        {icon ?? ICONS[type]}
      </div>
      {children}
    </div>
  )
}
