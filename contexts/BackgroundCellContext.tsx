import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { BACKGROUND_CELL_VALUES } from '~/utils/constants'

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
}

const BackgroundCellContextProvider = ({ children }: Props) => {
  const [backgroundCell, setBackgroundCell] = useState<Cell>(
    defaultContextValue,
  )

  useEffect(() => {
    try {
      setBackgroundCell(
        JSON.parse(localStorage.getItem('backgroundCell') || ''),
      )
    } catch (e) {}
  }, [])

  const saveAndSetBackgroundCell = (backgroundCell: Cell) => {
    try {
      setBackgroundCell(backgroundCell)
      localStorage.setItem('backgroundCell', JSON.stringify(backgroundCell))
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

export interface Cell {
  type: string
  value: string
}

interface BackgrounCell {
  backgroundCell: Cell
  setBackgroundCell: (cell: Cell) => void
}
