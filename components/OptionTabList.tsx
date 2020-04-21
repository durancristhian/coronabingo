import React, { ReactNode } from 'react'
import { TabList } from 'react-tabs'

interface Props {
  children: ReactNode
}

export default function OptionTabList({ children, ...otherProps }: Props) {
  return (
    <TabList {...otherProps}>
      <div className="flex justify-center items-center">{children}</div>
    </TabList>
  )
}

OptionTabList.tabsRole = 'TabList'
