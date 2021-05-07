import { Adsense } from '@ctrl/react-adsense'
import React, { useEffect, useState } from 'react'
import Container from './Container'

export default function Ads() {
  const [visible, setVisibility] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisibility(true)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  return visible ? (
    <div className="px-4">
      <Container size="large">
        <div className="flex justify-center mb-4">
          <Adsense
            client="ca-pub-6231280485856921"
            slot="1185318534"
            style={{
              display: 'inline-block',
              height: '90px',
              width: '728px',
            }}
          />
        </div>
      </Container>
    </div>
  ) : null
}
