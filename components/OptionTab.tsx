import React from 'react'
import { Tab } from 'react-tabs'
import Button from './Button'

interface Props {
  color?: 'gray' | 'green' | 'pink' | 'red' | 'yellow'
  Icon: Function
  id: string
  label: string
}

export default function OptionTab({
  color,
  Icon,
  id,
  label,
  ...otherProps
}: Props) {
  return (
    <Tab {...otherProps} className="my-2 md:mx-2 md:my-0 w-full md:w-auto">
      <Button id={id} className="w-full" color={color || 'gray'}>
        <Icon />
        <span className="ml-4">{label}</span>
      </Button>
    </Tab>
  )
}

OptionTab.tabsRole = 'Tab'
