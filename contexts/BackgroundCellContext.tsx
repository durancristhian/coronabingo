import { createContext, ReactNode, useState, useEffect } from 'react'
import { BACKGROUND_CELL_VALUES } from '~/utils/constants'

const defaultContextValue = {
  type: BACKGROUND_CELL_VALUES[0].type,
  value: BACKGROUND_CELL_VALUES[0].value
}
const BackgroundCellContext = createContext<IBackgrounCell>({
  backgroundCell: defaultContextValue,
  setBackgroundCell: () => {}
})

interface IProps {
  children: ReactNode
}

const BackgroundCellContextProvider = ({ children }: IProps) => {
  let [backgroundCell, setBackgroundCell] = useState<ICell>(defaultContextValue)

  useEffect(() => {
    try {
      setBackgroundCell(
        JSON.parse(localStorage.getItem('backgroundCell') || '')
      )
    } catch (e) {}
  }, [])

  const saveAndSetBackgroundCell = (backgroundCell: ICell) => {
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

export interface ICell {
  type: string
  value: string
}

interface IBackgrounCell {
  backgroundCell: ICell
  setBackgroundCell: (cell: ICell) => void
}
