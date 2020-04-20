import classnames from 'classnames'
import React, { useState } from 'react'
import { FiRepeat, FiSliders } from 'react-icons/fi'
import BackgroundCells from '~/components/BackgroundCells'
import { Room } from '~/interfaces'
import Container from './Container'
import Modal from './Modal'
import Restart from './Restart'

interface Props {
  room: Room
}

export default function Tabs({ room }: Props) {
  const [modal, setModal] = useState<{
    content: JSX.Element | null
    visible: boolean
  }>({ content: null, visible: false })

  const TABS = [
    { Icon: FiSliders, Component: <BackgroundCells /> },
    { Icon: FiRepeat, Component: <Restart room={room} /> },
  ]

  return (
    <div className="flex items-center justify-center">
      {TABS.map(({ Icon, Component }, index) => (
        <button
          onClick={() => setModal({ content: Component, visible: true })}
          key={index}
          className={classnames([
            'bg-gray-500 h-16 mx-2 outline-none rounded-full w-16',
            'focus:outline-none focus:shadow-outline',
            'duration-150 ease-in-out transition',
          ])}
        >
          <Icon className="m-auto text-2xl md:text-3xl text-white" />
        </button>
      ))}
      <Modal
        /* TODO */
        id="modal-"
        /* TODO */
        contentLabel="contentLabel"
        isOpen={modal.visible}
        onRequestClose={() => setModal({ content: null, visible: false })}
        className="modal"
        overlayClassName="overlay"
        /* TODO */
        title="Title"
      >
        <Container size="large">{modal.content}</Container>
      </Modal>
    </div>
  )
}
