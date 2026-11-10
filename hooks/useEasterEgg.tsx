import { useContext, useEffect, useState } from 'react'
import { DispatchContext, StateContext } from '~/contexts/Flags'
import { Flags } from '~/interfaces/contexts/Flags'

export default function useEasterEgg(name: keyof Flags) {
  const [interactions, setInteractions] = useState(0)
  const flags = useContext(StateContext)
  const dispatch = useContext(DispatchContext)

  useEffect(() => {
    if (interactions !== 7) return

    dispatch.toggle(name)
  }, [interactions])

  const incrementInteractions = () => {
    if (interactions < 7) {
      setInteractions(t => t + 1)
    }
  }

  return { isActive: flags[name], incrementInteractions }
}
