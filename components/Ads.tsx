import React, { useEffect, useRef } from 'react'
import { useAdScriptReady } from '~/contexts/AdScript'
import Container from './Container'

export default function Ads() {
  const ready = useAdScriptReady()
  const slot = useRef<HTMLModElement>(null)
  const requested = useRef<HTMLModElement | null>(null)

  useEffect(() => {
    const node = slot.current
    if (!ready || !node || requested.current === node) return

    const request = (
      _entries: ResizeObserverEntry[],
      observer: ResizeObserver,
    ) => {
      if (
        !node.isConnected ||
        slot.current !== node ||
        requested.current === node ||
        node.getBoundingClientRect().width <= 0
      ) {
        return
      }

      // The DOM node owns the request, including when effects replay.
      requested.current = node
      observer.disconnect()
      try {
        const adsWindow = window as Window & {
          adsbygoogle?: { push: (request: Record<string, never>) => void }
        }
        if (!adsWindow.adsbygoogle) throw new Error('AdSense unavailable')
        adsWindow.adsbygoogle.push({})
      } catch {
        // An advertising failure must not interrupt the game or retry a slot.
        console.warn('AdSense could not initialize the manual ad.')
      }
    }

    const observer = new ResizeObserver(request)
    observer.observe(node)
    request([], observer)
    return () => observer.disconnect()
  }, [ready])

  return (
    <div className="px-4">
      <Container size="large">
        <div className="flex justify-center mb-4">
          <div
            className="cb-ad-reservation"
            style={{
              height: '90px',
              width: '100%',
              maxWidth: '728px',
            }}
          >
            {ready && (
              <ins
                ref={slot}
                className="adsbygoogle"
                data-ad-client="ca-pub-6231280485856921"
                data-ad-slot="1185318534"
                style={{ display: 'block', width: '100%', height: '90px' }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
