import { useRef, useState } from 'react'

export default function usePendingOperation() {
  const locked = useRef(false)
  const [pending, setPending] = useState(false)

  const run = async (operation: () => Promise<void>) => {
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
