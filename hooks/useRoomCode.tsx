import { useContext } from 'react'
import {
  ActionByStateKey,
  DispatchContext,
  StateContext,
} from '~/contexts/Flags'

const NAME = 'roomCode'

export default function useRoomCode() {
  const flags = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  const login = () => {
    dispatch.toggle(ActionByStateKey[NAME])
  }

  return { loggedIn: flags[NAME], login }
}
