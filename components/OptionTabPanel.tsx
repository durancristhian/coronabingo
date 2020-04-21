import React, { ReactNode } from 'react'
import { TabPanel } from 'react-tabs'
import Container from '~/components/Container'
import Modal from '~/components/Modal'

interface Props {
  children: ReactNode
  contentLabel: string
  id: string
  onRequestClose: Function
  title: ReactNode
}

export default function OptionTabPanel({
  children,
  contentLabel,
  id,
  onRequestClose,
  title,
  ...otherProps
}: Props) {
  return (
    <TabPanel {...otherProps}>
      <Modal
        className="modal"
        contentLabel={contentLabel}
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
