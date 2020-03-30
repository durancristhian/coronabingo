import classnames from 'classnames'
import { useContext } from 'react'
import { BackgroundCellContext } from '~/contexts/BackgroundCellContext'

export default function EmptyCell() {
  const { backgroundCell } = useContext(BackgroundCellContext)

  return (
    <div
      className={classnames([
        'bg-center bg-contain bg-no-repeat border-b-2 border-r-2 border-gray-900 flex h-8 sm:h-20 items-center justify-center p-1 relative w-1/10',
        backgroundCell.type === 'color' &&
          ((backgroundCell.value === 'blue' && 'bg-blue-300') ||
            (backgroundCell.value === 'green' && 'bg-green-300') ||
            (backgroundCell.value === 'orange' && 'bg-orange-300') ||
            (backgroundCell.value === 'yellow' && 'bg-yellow-300'))
      ])}
      style={{
        ...(backgroundCell.type === 'img' && {
          backgroundImage: `url(/background-cells/${backgroundCell.value})`
        }),
        ...(backgroundCell.type === 'url' && {
          backgroundImage: `url(${backgroundCell.value})`
        })
      }}
    ></div>
  )
}
