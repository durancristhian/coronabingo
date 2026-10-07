import React, { useEffect, useRef, useState } from 'react'
import { useAdScriptStatus } from '~/contexts/AdScript'
import Container from './Container'

export default function Ads() {
  const scriptStatus = useAdScriptStatus()
  const ready = scriptStatus === 'ready'
  const [dismissed, setDismissed] = useState(false)
  const collapsed = scriptStatus === 'unavailable' || dismissed
  const reservation = useRef<HTMLDivElement>(null)
  const slot = useRef<HTMLModElement>(null)
  const requested = useRef<HTMLModElement | null>(null)

  useEffect(() => {
    const node = slot.current
    const space = reservation.current
    if (!ready || collapsed || !node || !space) return

    const checkFit = () => {
      if (!node.isConnected) return
      // Measure the complete unit synchronously, including while hidden. The
      // final display state is restored before paint; no creative is resized.
      node.removeAttribute('data-ad-overflow')
      const bounds = space.getBoundingClientRect()
      const outside = (element: Element) => {
        const rect = element.getBoundingClientRect()
        if (!rect.width || !rect.height) return false
        return (
          rect.left < bounds.left - 0.5 ||
          rect.right > bounds.right + 0.5 ||
          rect.top < bounds.top - 0.5 ||
          rect.bottom > bounds.bottom + 0.5
        )
      }
      if (
        outside(node) ||
        Array.from(node.querySelectorAll('iframe')).some(outside)
      ) {
        node.setAttribute('data-ad-overflow', 'true')
      }
    }

    // Observe the reservation, not the hidden unit: hiding must not trigger a
    // resize-observer feedback loop. SDK mutations cover late iframe sizing.
    const resize = new ResizeObserver(checkFit)
    resize.observe(space)
    const mutations = new MutationObserver(checkFit)
    mutations.observe(node, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'width', 'height', 'class', 'data-ad-status'],
    })
    checkFit()
    return () => {
      resize.disconnect()
      mutations.disconnect()
    }
  }, [ready, collapsed])

  useEffect(() => {
    const node = slot.current
    if (!ready || collapsed || !node) return

    const hasOutcome = () =>
      ['filled', 'unfilled', 'unfill-optimized'].includes(
        node.getAttribute('data-ad-status') || '',
      )
    // Loading silence is not proof of an ad blocker. Bound the empty wait,
    // accepting that an unusually slow response may be discarded.
    const timeout = window.setTimeout(() => {
      if (!hasOutcome()) setDismissed(true)
    }, 5_000)
    const checkStatus = () => {
      if (hasOutcome()) window.clearTimeout(timeout)
      if (node.getAttribute('data-ad-status') === 'unfilled') setDismissed(true)
    }
    const observer = new MutationObserver(checkStatus)
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    })
    checkStatus()
    return () => {
      window.clearTimeout(timeout)
      observer.disconnect()
    }
  }, [ready, collapsed])

  useEffect(() => {
    const node = slot.current
    if (!ready || collapsed || !node || requested.current === node) return

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
        setDismissed(true)
      }
    }

    const observer = new ResizeObserver(request)
    observer.observe(node)
    request([], observer)
    return () => observer.disconnect()
  }, [ready, collapsed])

  if (collapsed) return null

  return (
    <div className="px-4">
      <Container size="large">
        <div className="flex justify-center mb-4">
          <div
            ref={reservation}
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
                data-ad-slot="9427584752"
                style={{ display: 'block', width: '100%', height: '90px' }}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
