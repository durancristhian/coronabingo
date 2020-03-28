import { createContext, ReactNode, useState } from 'react'
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

  return (
    <BackgroundCellContext.Provider
      value={{ backgroundCell, setBackgroundCell }}
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
