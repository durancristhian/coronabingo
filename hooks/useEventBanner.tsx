import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function useEventBanner() {
  const { pathname } = useRouter()
  const playerPage = ['[roomId]', '[playerId]']
  const adminPage = ['/admin']
  const eventPage = ['[eventId]']

  const showEventBanner = useMemo(() => {
    const isPlayerPage = playerPage.every(slug => pathname.includes(slug))
    const isAdminPage = adminPage.every(slug => pathname.includes(slug))
    const isEventPage = eventPage.every(slug => pathname.includes(slug))

    return !(isPlayerPage || isAdminPage || isEventPage)
  }, [pathname])

  return showEventBanner
}
