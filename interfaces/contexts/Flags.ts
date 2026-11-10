export interface Flags {
  downloadSpreadsheet: boolean
  extraSounds: boolean
  useRoomExperiments: boolean
}

export interface FlagsDispatch {
  toggle: (name: keyof Flags) => void
}
