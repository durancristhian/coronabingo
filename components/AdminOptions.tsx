import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FiRotateCcw, FiSmile, FiVolume2 } from 'react-icons/fi'
import { Tabs } from 'react-tabs'
import { Room } from '~/interfaces'
import Celebrations from './Celebrations'
import OptionTab from './OptionTab'
import OptionTabList from './OptionTabList'
import OptionTabPanel from './OptionTabPanel'
import Pato from './Pato'
import Restart from './Restart'

interface Props {
  room: Room
}

export default function AdminOptions({ room }: Props) {
  const { t } = useTranslation()
  const [currentTabIndex, setCurrentTabIndex] = useState(-1)

  const resetCurrentTabIndex = () => {
    setCurrentTabIndex(-1)
  }

  return (
    <Tabs selectedIndex={currentTabIndex} onSelect={setCurrentTabIndex}>
      <OptionTabList>
        <Fragment>
          <OptionTab
            Icon={FiSmile}
            id="celebrations"
            label={t('jugar:celebrations')}
          ></OptionTab>
          <OptionTab
            Icon={FiVolume2}
            id="sounds"
            label={t('jugar:sounds')}
          ></OptionTab>
          <OptionTab
            color="red"
            Icon={FiRotateCcw}
            id="reboot-game"
            label={t('jugar:replay.reboot-game')}
          ></OptionTab>
        </Fragment>
      </OptionTabList>
      <OptionTabPanel
        id="modal-celebrations"
        title={t('jugar:celebrations')}
        onRequestClose={resetCurrentTabIndex}
      >
        <Celebrations room={room} />
      </OptionTabPanel>
      <OptionTabPanel
        id="modal-sounds"
        title={t('jugar:sounds')}
        onRequestClose={resetCurrentTabIndex}
      >
        <Pato room={room} />
      </OptionTabPanel>
      <OptionTabPanel
        id="modal-restart"
        title={t('jugar:replay.reboot-game')}
        onRequestClose={resetCurrentTabIndex}
      >
        <Restart room={room} />
      </OptionTabPanel>
    </Tabs>
  )
}
