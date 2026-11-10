import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { toast, ToastId } from 'react-toastify'
import Message from '~/components/Message'
import { MessageType } from '~/interfaces/custom/Message'

const toastConfig = {
  autoClose: 10000,
  closeButton: false,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_LEFT,
}

export default function useToast() {
  const { t } = useTranslation()

  const renderToast = (translationKey: string, messageType: MessageType) => (
    <div className="w-full">
      <Message type={messageType}>{t(translationKey)}</Message>
    </div>
  )

  const dismissAfter = (toastId: ToastId, milliseconds?: number) => {
    if (milliseconds === undefined) return
    setTimeout(() => toast.dismiss(toastId), milliseconds)
  }

  const createToast = (
    translationKey: string,
    messageType: MessageType,
    dismissAfterMs?: number,
  ) => {
    const toastId = toast(renderToast(translationKey, messageType), toastConfig)
    dismissAfter(toastId, dismissAfterMs)
    return toastId
  }

  const updateToast = (
    translationKey: string,
    messageType: MessageType,
    toastId: ToastId,
    dismissAfterMs?: number,
  ) => {
    toast.update(toastId, {
      render: renderToast(translationKey, messageType),
    })
    dismissAfter(toastId, dismissAfterMs)
  }

  return {
    createToast,
    dismissToast: toast.dismiss,
    updateToast,
  }
}
