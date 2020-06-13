import React from 'react'
import Pelotita from './Pelotita'

interface Props {
  index: number
  number: number
}

export default function Ball({ index, number }: Props) {
  return (
    <Pelotita index={index}>
      <div className="ball">
        <span data-test-class="ball">{number}</span>
      </div>
    </Pelotita>
  )
}
