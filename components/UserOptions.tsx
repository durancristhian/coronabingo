import useTranslation from 'next-translate/useTranslation'
import React, { useState } from 'react'
import { FiSettings } from 'react-icons/fi'
import { Tabs } from 'react-tabs'
import BackgroundCells from '~/components/BackgroundCells'
import OptionTab from './OptionTab'
import OptionTabList from './OptionTabList'
import OptionTabPanel from './OptionTabPanel'

export default function UserOptions() {
  const { t } = useTranslation()
  const [currentTabIndex, setCurrentTabIndex] = useState(-1)

  const resetCurrentTabIndex = () => {
    setCurrentTabIndex(-1)
  }

  return (
    <Tabs selectedIndex={currentTabIndex} onSelect={setCurrentTabIndex}>
      <OptionTabList>
        <OptionTab
          color="yellow"
          id="configure-empty-cells"
          Icon={FiSettings}
          label={t('jugar:user-options.configure-boards')}
        ></OptionTab>
      </OptionTabList>
      <OptionTabPanel
        id="modal-background-cells"
        title={t('jugar:empty-cells.title')}
        onRequestClose={resetCurrentTabIndex}
      >
        <BackgroundCells />
      </OptionTabPanel>
    </Tabs>
  )
}
