import classnames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
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
  const { t } = useTranslation()
  const defaultModalValue = {
    config: { id: '', title: '' },
    content: null,
    visible: false,
  }
  const [modal, setModal] = useState<{
    config: {
      id: string
      title: string
    }
    content: JSX.Element | null
    visible: boolean
  }>(defaultModalValue)

  const TABS = [
    {
      Icon: FiSliders,
      Component: <BackgroundCells />,
      config: {
        id: 'modal-background-cells',
        title: t('jugar:empty-cells.title'),
      },
    },
    {
      Icon: FiRepeat,
      Component: <Restart room={room} />,
      config: {
        id: 'modal-restart',
        title: t('jugar:replay.reboot-game'),
      },
    },
  ]

  return (
    <div className="flex items-center justify-center">
      {TABS.map(({ Component, Icon, config }, index) => (
        <button
          onClick={() =>
            setModal({ config, content: Component, visible: true })
          }
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
        id={modal.config.id}
        contentLabel={modal.config.title}
        isOpen={modal.visible}
        onRequestClose={() => setModal(defaultModalValue)}
        className="modal"
        overlayClassName="overlay"
        title={modal.config.title}
      >
        <Container size="large">{modal.content}</Container>
      </Modal>
    </div>
  )
}
