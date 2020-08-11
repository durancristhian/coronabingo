import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { toast, ToastId } from 'react-toastify'
import Message from '~/components/Message'
import { MessageType } from '~/interfaces'

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

  const createToast = (translationKey: string, messageType: MessageType) =>
    toast(renderToast(translationKey, messageType), {
      ...toastConfig,
    })

  const dismissToast = (toastId: ToastId) => {
    toast.dismiss(toastId)
  }

  const updateToast = (
    translationKey: string,
    messageType: MessageType,
    toastId: ToastId,
  ) => {
    toast.update(toastId, {
      render: renderToast(translationKey, messageType),
    })
  }

  return {
    createToast,
    dismissToast,
    updateToast,
  }
}
