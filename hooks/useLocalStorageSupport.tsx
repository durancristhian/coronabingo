import { useEffect, useState } from 'react'
import { isThereLocalStorageSupport } from '~/utils'

export default function useLocalStorageSupport(): boolean {
  const [localStorageSupport, setLocalStorageSupport] = useState<boolean>(true)

  useEffect(() => {
    setLocalStorageSupport(isThereLocalStorageSupport())
  }, [])

  return localStorageSupport
}
