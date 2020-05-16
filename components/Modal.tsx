import classnames from 'classnames'
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
  return (
    <ReactModal {...rest}>
      <Box>
        <div className="flex items-start justify-between mb-4 text-lg md:text-xl">
          <Heading type="h2">{title}</Heading>
          <button
            onClick={rest.onRequestClose}
            className={classnames([
              'text-lg',
              'focus:outline-none focus:shadow-outline',
              'duration-150 ease-in-out transition',
            ])}
            id="close-modal"
          >
            <FiX color="gray" />
          </button>
        </div>
        {children}
      </Box>
    </ReactModal>
  )
}
