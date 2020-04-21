import React, { createContext, ReactNode, useState } from 'react'
import { EasterEgg } from '~/interfaces'

const EasterEggContext = createContext<EasterEgg>({
  isVisible: false,
  setVisibility: () => void 0,
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
