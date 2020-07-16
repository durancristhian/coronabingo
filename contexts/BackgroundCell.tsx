import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { BackgrounCell, Cell } from '~/interfaces'
import { BACKGROUND_CELL_VALUES } from '~/utils'

const defaultContextValue = {
  type: BACKGROUND_CELL_VALUES[0].type,
  value: BACKGROUND_CELL_VALUES[0].value,
}
const BackgroundCellContext = createContext<BackgrounCell>({
  backgroundCell: defaultContextValue,
  setBackgroundCell: () => void 0,
})

interface Props {
  children: ReactNode
  playerId: string
}

const BackgroundCellContextProvider = ({ children, playerId }: Props) => {
  const [backgroundCell, setBackgroundCell] = useState<Cell>(
    defaultContextValue,
  )

  useEffect(() => {
    try {
      const backgroundCell = JSON.parse(
        localStorage.getItem('backgroundCell') || '',
      )?.[playerId]

      backgroundCell && setBackgroundCell(backgroundCell)
    } catch (e) {}
  }, [])

  const saveAndSetBackgroundCell = (backgroundCell: Cell) => {
    try {
      setBackgroundCell(backgroundCell)

      localStorage.setItem(
        'backgroundCell',
        JSON.stringify({ [playerId]: backgroundCell }),
      )
    } catch (e) {}
  }

  return (
    <BackgroundCellContext.Provider
      value={{ backgroundCell, setBackgroundCell: saveAndSetBackgroundCell }}
    >
      {children}
    </BackgroundCellContext.Provider>
  )
}

export { BackgroundCellContext, BackgroundCellContextProvider }
