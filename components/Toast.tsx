import React, { useEffect } from 'react'
import Message, { Message as IMessage } from './Message'

interface ToastProps extends IMessage {
  onDismiss: Function
  show: boolean
  time?: number
}

export default function Toast({
  children,
  onDismiss,
  show,
  time = 2000,
  type,
}: ToastProps) {
  useEffect(() => {
    setTimeout(() => {
      show && onDismiss()
    }, time)
  }, [show])
  return (
    <div
      className="toast"
      style={{
        bottom: show ? 16 : -100,
      }}
    >
      <Message type={type}>{children}</Message>
    </div>
  )
}
