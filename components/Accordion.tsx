import classnames from 'classnames'
import React, { Fragment, ReactNode, useState } from 'react'

interface Props {
  children: ReactNode
  id: string
  label: ReactNode
}

export default function Accordion({ children, id, label }: Props) {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(prev => !prev)
  }

  return (
    <Fragment>
      <button
        className={classnames([
          'block text-left w-full',
          'focus:outline-none focus:shadow-outline',
          'duration-150 ease-in-out transition',
        ])}
        id={id}
        onClick={toggleVisibility}
      >
        {label}
      </button>
      {visible && children}
    </Fragment>
  )
}
