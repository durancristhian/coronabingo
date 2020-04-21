import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FiRotateCcw, FiSettings, FiSmile, FiVolume2 } from 'react-icons/fi'
import { Tabs } from 'react-tabs'
import BackgroundCells from '~/components/BackgroundCells'
import { Room } from '~/interfaces'
import Celebrations from './Celebrations'
import OptionTab from './OptionTab'
import OptionTabList from './OptionTabList'
import OptionTabPanel from './OptionTabPanel'
import Pato from './Pato'
import Restart from './Restart'

interface Props {
  isAdmin: boolean
  room: Room
}

export default function Options({ isAdmin, room }: Props) {
  const { t } = useTranslation()
  const [currentTabIndex, setCurrentTabIndex] = useState(-1)

  const resetCurrentTabIndex = () => {
    setCurrentTabIndex(-1)
  }

  return (
    <Tabs selectedIndex={currentTabIndex} onSelect={setCurrentTabIndex}>
      <OptionTabList>
        <OptionTab
          Icon={FiSettings}
          iconBgColor="bg-yellow-300"
          iconColor="text-yellow-800"
          id="configure-empty-cells"
        ></OptionTab>
        {isAdmin && (
          <Fragment>
            <OptionTab
              Icon={FiSmile}
              iconBgColor="bg-green-300"
              iconColor="text-green-800"
              id="celebrations"
            ></OptionTab>
            <OptionTab
              Icon={FiVolume2}
              iconBgColor="bg-green-300"
              iconColor="text-green-800"
              id="sounds"
            ></OptionTab>
            <OptionTab
              Icon={FiRotateCcw}
              iconBgColor="bg-red-300"
              iconColor="text-red-800"
              id="reboot-game"
            ></OptionTab>
          </Fragment>
        )}
      </OptionTabList>
      <OptionTabPanel
        id="modal-background-cells"
        title={t('jugar:empty-cells.title')}
        onRequestClose={resetCurrentTabIndex}
      >
        <BackgroundCells />
      </OptionTabPanel>
      {isAdmin && (
        <Fragment>
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
        </Fragment>
      )}
    </Tabs>
  )
}
