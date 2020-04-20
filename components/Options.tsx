import useTranslation from 'next-translate/useTranslation'
import React, { Fragment, useState } from 'react'
import { FiCloudSnow, FiRepeat, FiSliders, FiVolume2 } from 'react-icons/fi'
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
        <OptionTab Icon={FiSliders}></OptionTab>
        {isAdmin && (
          <Fragment>
            <OptionTab Icon={FiCloudSnow}></OptionTab>
            <OptionTab Icon={FiVolume2}></OptionTab>
            <OptionTab Icon={FiRepeat}></OptionTab>
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
