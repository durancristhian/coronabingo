import classnames from 'classnames'
import React from 'react'
import { Tab } from 'react-tabs'

interface Props {
  Icon: Function
}

export default function OptionTab({ Icon }: Props) {
  /* TODO: is a button the better option here? semantically speaking */
  return (
    <Tab>
      <button
        className={classnames([
          'bg-gray-500 block h-16 mx-2 outline-none rounded-full w-16',
          'focus:outline-none focus:shadow-outline',
          'duration-150 ease-in-out transition',
        ])}
      >
        <Icon className="m-auto text-2xl md:text-3xl text-white" />
      </button>
    </Tab>
  )
}

OptionTab.tabsRole = 'Tab'
