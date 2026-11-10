import classnames from 'classnames'
import React, { useContext } from 'react'
import { BackgroundCellContext } from '~/contexts/BackgroundCell'
import { getBackgroundCellAppearance } from '~/utils/backgroundCell'

export default function EmptyCell({ index }: { index: number }) {
  const { backgroundCell } = useContext(BackgroundCellContext)

  const appearance = getBackgroundCellAppearance(backgroundCell, index)

  return (
    <div
      className={classnames([
        'cb-ticket-cell cb-ticket-cell--empty',
        'bg-center bg-contain bg-gray-200 bg-no-repeat border-b-2 border-r-2 border-gray-900 flex h-8 sm:h-20 items-center justify-center p-1 relative w-1/10',
        appearance.className,
      ])}
      style={appearance.style}
    ></div>
  )
}
