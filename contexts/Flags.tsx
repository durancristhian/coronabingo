import React, { createContext, ReactNode, useReducer } from 'react'

const defaultState = {
  downloadSpreadsheet: false,
  extraSounds: false,
}

const defaultDispatch = {
  toggle: () => void 0,
}

export interface Flags {
  downloadSpreadsheet: boolean
  extraSounds: boolean
}

interface Dispatch {
  toggle: (action: Action) => void
}

enum Actions {
  DOWNLOAD_SPREADSHEET_TOGGLE = 'DOWNLOAD_SPREADSHEET_TOGGLE',
  EXTRA_SOUNDS_TOGGLE = 'EXTRA_SOUNDS_TOGGLE',
}

export const ActionByStateKey = {
  downloadSpreadsheet: { type: Actions.DOWNLOAD_SPREADSHEET_TOGGLE },
  extraSounds: { type: Actions.EXTRA_SOUNDS_TOGGLE },
}

interface Action {
  type: Actions.DOWNLOAD_SPREADSHEET_TOGGLE | Actions.EXTRA_SOUNDS_TOGGLE
}

const StateContext = createContext<Flags>(defaultState)
const DispatchContext = createContext<Dispatch>(defaultDispatch)

const reducer = (state: Flags, action: Action) => {
  switch (action.type) {
    case Actions.DOWNLOAD_SPREADSHEET_TOGGLE:
      return {
        ...state,
        downloadSpreadsheet: !state.downloadSpreadsheet,
      }
    case Actions.EXTRA_SOUNDS_TOGGLE:
      return {
        ...state,
        extraSounds: !state.extraSounds,
      }
    default:
      return state
  }
}

interface Props {
  children: ReactNode
}

const Provider = ({ children }: Props) => {
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

export const FlagsContext = {
  Dispatch: DispatchContext,
  Provider,
  State: StateContext,
}
