import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode } from 'react'
import { FiX } from 'react-icons/fi'
import ReactModal from 'react-modal'
import Box from '~/components/Box'
import Heading from '~/components/Heading'

ReactModal.setAppElement('#__next')

interface Props extends ReactModal.Props {
  children: ReactNode
  title: ReactNode
}

export default function Modal({ children, title, ...rest }: Props) {
  const { t } = useTranslation()

  return (
    <ReactModal {...rest}>
      <Box className="cb-modal-panel">
        <div className="cb-modal-header text-lg md:text-xl">
          <Heading type="h2">{title}</Heading>
          <button
            type="button"
            onClick={rest.onRequestClose}
            className={classnames([
              'cb-modal-close',
              'text-lg',
              'focus:outline-none focus:shadow-outline',
              'duration-150 ease-in-out transition',
            ])}
            id="close-modal"
            aria-label={t('common:close')}
            title={t('common:close')}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
        <div className="cb-modal-body">{children}</div>
      </Box>
    </ReactModal>
  )
}
