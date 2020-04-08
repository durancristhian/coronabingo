import React, { createContext, ReactNode, useState } from 'react'

const EasterEggContext = createContext<EasterEgg>({
  isVisible: false,
  setVisibility: () => {},
})

interface Props {
  children: ReactNode
}

const EasterEggContextProvider = ({ children }: Props) => {
  const [isVisible, setVisibility] = useState(false)

  return (
    <EasterEggContext.Provider value={{ isVisible, setVisibility }}>
      {children}
    </EasterEggContext.Provider>
  )
}

export { EasterEggContext, EasterEggContextProvider }

interface EasterEgg {
  isVisible: boolean
  setVisibility: (visibility: boolean) => void
}
