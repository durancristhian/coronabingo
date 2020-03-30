import { createContext, ReactNode, useState } from 'react'

const EasterEggContext = createContext<IEasterEgg>({
  isVisible: false,
  setVisibility: () => {}
})

interface IProps {
  children: ReactNode
}

const EasterEggContextProvider = ({ children }: IProps) => {
  let [isVisible, setVisibility] = useState(false)

  return (
    <EasterEggContext.Provider value={{ isVisible, setVisibility }}>
      {children}
    </EasterEggContext.Provider>
  )
}

export { EasterEggContext, EasterEggContextProvider }

interface IEasterEgg {
  isVisible: boolean
  setVisibility: (visibility: boolean) => void
}
