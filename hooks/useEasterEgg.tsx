import { useContext, useEffect, useState } from 'react'
import { ActionByStateKey, Flags, FlagsContext } from '~/contexts/Flags'

export default function useEasterEgg(name: keyof Flags) {
  const [interactions, setInteractions] = useState(0)
  const flags = useContext(FlagsContext.State)
  const dispatch = useContext(FlagsContext.Dispatch)

  useEffect(() => {
    if (interactions !== 7) return

    dispatch.toggle(ActionByStateKey[name])
  }, [interactions])

  const incrementInteractions = () => {
    if (interactions < 7) {
      setInteractions(t => t + 1)
    }
  }

  return { isActive: flags[name], incrementInteractions }
}
