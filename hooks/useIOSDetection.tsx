import { useEffect, useState } from 'react'

const iDevices = [
  'iPad Simulator',
  'iPhone Simulator',
  'iPod Simulator',
  'iPad',
  'iPhone',
  'iPod',
]

export default function useIOSDetection() {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    setIsIOS(iDevices.includes(navigator.platform))
  }, [])

  return isIOS
}
