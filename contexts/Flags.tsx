import React, { createContext, ReactNode, useReducer } from 'react'
import { FlagAction, FlagActions, Flags, FlagsDispatch } from '~/interfaces'

const defaultState = {
  downloadSpreadsheet: false,
  extraSounds: false,
  roomCode: false,
  useRoomExperiments: false,
}

const defaultDispatch = {
  toggle: () => void 0,
}

const ActionByStateKey = {
  downloadSpreadsheet: { type: FlagActions.DOWNLOAD_SPREADSHEET_TOGGLE },
  extraSounds: { type: FlagActions.EXTRA_SOUNDS_TOGGLE },
  roomCode: { type: FlagActions.ROOM_CODE_TOGGLE },
  useRoomExperiments: { type: FlagActions.ROOM_EXPERIMENTS_TOGGLE },
}

const StateContext = createContext<Flags>(defaultState)
const DispatchContext = createContext<FlagsDispatch>(defaultDispatch)

const reducer = (state: Flags, action: FlagAction) => {
  switch (action.type) {
    case FlagActions.DOWNLOAD_SPREADSHEET_TOGGLE:
      return {
        ...state,
        downloadSpreadsheet: !state.downloadSpreadsheet,
      }
    case FlagActions.EXTRA_SOUNDS_TOGGLE:
      return {
        ...state,
        extraSounds: !state.extraSounds,
      }
    case FlagActions.ROOM_CODE_TOGGLE:
      return {
        ...state,
        roomCode: !state.roomCode,
      }
    case FlagActions.ROOM_EXPERIMENTS_TOGGLE:
      return {
        ...state,
        useRoomExperiments: !state.useRoomExperiments,
      }
    default:
      return state
  }
}

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

export { ActionByStateKey, DispatchContext, FlagsContextProvider, StateContext }
