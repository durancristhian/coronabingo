import { useEffect, useState } from 'react'

export default function useIOSDetection() {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const iDevices = [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ]

    if (!!navigator.platform) {
      while (iDevices.length) {
        if (navigator.platform === iDevices.pop()) {
          setIsIOS(true)

          return
        }
      }
    }

    setIsIOS(false)
  }, [])

  return isIOS
}
