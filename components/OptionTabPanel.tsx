import React, { ReactNode } from 'react'
import { TabPanel } from 'react-tabs'
import Container from './Container'
import Modal from './Modal'

interface Props {
  children: ReactNode
  id: string
  onRequestClose: Function
  title: string
}

export default function OptionTabPanel({
  children,
  id,
  onRequestClose,
  title,
  ...otherProps
}: Props) {
  return (
    <TabPanel {...otherProps}>
      <Modal
        className="modal"
        contentLabel={title}
        id={id}
        isOpen={true}
        onRequestClose={() => {
          onRequestClose()
        }}
        overlayClassName="overlay"
        title={title}
      >
        <Container size="large">{children}</Container>
      </Modal>
    </TabPanel>
  )
}

OptionTabPanel.tabsRole = 'TabPanel'
