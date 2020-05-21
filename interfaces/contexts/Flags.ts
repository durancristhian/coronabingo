export enum FlagActions {
  DOWNLOAD_SPREADSHEET_TOGGLE = 'DOWNLOAD_SPREADSHEET_TOGGLE',
  EXTRA_SOUNDS_TOGGLE = 'EXTRA_SOUNDS_TOGGLE',
  ROOM_CODE_TOGGLE = 'ROOM_CODE_TOGGLE',
  ROOM_EXPERIMENTS_TOGGLE = 'ROOM_EXPERIMENTS_TOGGLE',
}

export interface FlagAction {
  type:
    | FlagActions.DOWNLOAD_SPREADSHEET_TOGGLE
    | FlagActions.EXTRA_SOUNDS_TOGGLE
    | FlagActions.ROOM_CODE_TOGGLE
    | FlagActions.ROOM_EXPERIMENTS_TOGGLE
}

export interface Flags {
  downloadSpreadsheet: boolean
  extraSounds: boolean
  roomCode: boolean
  useRoomExperiments: boolean
}

export interface FlagsDispatch {
  toggle: (action: FlagAction) => void
}
