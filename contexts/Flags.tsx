import React, { createContext, ReactNode, useReducer } from 'react'
import { Flags, FlagsDispatch } from '~/interfaces/contexts/Flags'

const defaultState = {
  downloadSpreadsheet: false,
  extraSounds: false,
  useRoomExperiments: false,
}

const defaultDispatch = {
  toggle: () => void 0,
}

const StateContext = createContext<Flags>(defaultState)
const DispatchContext = createContext<FlagsDispatch>(defaultDispatch)

const reducer = (state: Flags, name: keyof Flags): Flags => ({
  ...state,
  [name]: !state[name],
})

interface Props {
  children: ReactNode
}

const FlagsContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, defaultState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider
        value={{
          toggle: dispatch,
        }}
      >
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export { DispatchContext, FlagsContextProvider, StateContext }
