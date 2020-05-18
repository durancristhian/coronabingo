import classnames from 'classnames'
import React from 'react'
import { Tab } from 'react-tabs'

interface Props {
  buttonId: string
  Icon: Function
  iconBgColor: string
  iconColor: string
}

export default function OptionTab({
  buttonId,
  Icon,
  iconBgColor,
  iconColor,
  ...otherProps
}: Props) {
  return (
    <Tab {...otherProps} className="mx-2">
      <button
        id={buttonId}
        className={classnames([
          'block h-12 mx-1 outline-none rounded-full shadow w-12',
          'focus:outline-none focus:shadow-outline',
          'duration-150 ease-in-out transition',
          iconBgColor,
        ])}
      >
        <Icon
          className={classnames(['m-auto text-2xl md:text-3xl', iconColor])}
        />
      </button>
    </Tab>
  )
}

OptionTab.tabsRole = 'Tab'
