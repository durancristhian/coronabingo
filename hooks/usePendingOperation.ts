import { useRef, useState } from 'react'

// For operations that release their lock on settlement, including failed writes.
export default function usePendingOperation() {
  const locked = useRef(false)
  const [pending, setPending] = useState(false)

  const run = async (operation: () => Promise<void>) => {
    // State alone cannot block a second call before React renders.
    if (locked.current) return

    locked.current = true
    setPending(true)
    try {
      await operation()
    } finally {
      locked.current = false
      setPending(false)
    }
  }

  return { pending, run }
}
