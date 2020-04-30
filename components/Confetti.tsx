import classnames from 'classnames'
import React, { Component } from 'react'
import { ConfettiType } from '~/interfaces'

const confettiClasses = [
  'confetti-1',
  'confetti-2',
  'confetti-3',
  'confetti-4',
  'confetti-5',
  'confetti-6',
  'confetti-7',
  'confetti-8',
  'confetti-9',
  'confetti-10',
  'confetti-11',
  'confetti-12',
  'confetti-13',
  'confetti-14',
  'confetti-15',
  'confetti-16',
  'confetti-17',
  'confetti-18',
  'confetti-19',
  'confetti-20',
]

const pallbearersClasses = [
  'pallbearer-1',
  'pallbearer-2',
  'pallbearer-3',
  'pallbearer-4',
  'pallbearer-1',
  'pallbearer-2',
  'pallbearer-3',
  'pallbearer-4',
  'pallbearer-1',
  'pallbearer-2',
  'pallbearer-3',
  'pallbearer-4',
  'pallbearer-1',
  'pallbearer-2',
  'pallbearer-3',
  'pallbearer-4',
  'pallbearer-1',
  'pallbearer-2',
  'pallbearer-3',
  'pallbearer-4',
]

const confettiType = {
  confetti: confettiClasses,
  pallbearers: pallbearersClasses,
}

export const confettiTypes = ['confetti', 'pallbearers']

interface Props {
  type: ConfettiType
}

export default class Confetti extends Component<Props> {
  render() {
    const { type } = this.props

    if (!type) return null

    const classes = confettiType[type]

    return classes.map((c, i) => (
      <div className={classnames(['confetti-base', c])} key={i} />
    ))
  }
}
