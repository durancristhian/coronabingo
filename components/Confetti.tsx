import classnames from 'classnames'
import React, { Fragment, memo } from 'react'
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
  balloons: [],
  confetti: confettiClasses,
  pallbearers: pallbearersClasses,
}

export const confettiTypes = ['confetti', 'pallbearers', 'balloons']

interface Props {
  type: ConfettiType
}

export default memo(function Confetti({ type }: Props) {
  if (!type) return null

  if (type !== 'balloons') {
    const classes = confettiType[type]

    return (
      <Fragment>
        {classes.map((c, i) => (
          <div className={classnames(['confetti-base', c])} key={i} />
        ))}
      </Fragment>
    )
  }

  const randomInteger = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const renderBalloons = () => {
    const balloons = [...Array(25).keys()]

    return (
      <div className="balloons-container">
        {balloons.map(b => (
          <div
            key={b}
            className="balloon"
            style={
              {
                '--x': randomInteger(0, 100),
                '--h': randomInteger(0, 360),
                '--s': randomInteger(15, 50),
                '--d': randomInteger(1, 10),
                '--delay': randomInteger(0, 10),
              } as React.CSSProperties
            }
          >
            <div className="balloon__handle"></div>
          </div>
        ))}
      </div>
    )
  }

  return renderBalloons()
})
