import { useEffect, useState } from 'react'

interface Extras {
  showConfetti?: boolean
  soundToPlay?: string
}

export default function useWebSocket(
  playerId: string = '',
  roomId: string
): [Extras, (m: {}) => void] {
  const [wsClient, setWsClient] = useState<WebSocket>()
  const [extras, setExtras] = useState<Extras>({})

  useEffect(() => {
    if (!playerId || !roomId) return
    const ws = new WebSocket(
      `${process.env.SOCKET_URL}?playerId=${playerId}&room=${roomId}`
    )
    setWsClient(ws)
    ws.onmessage = (msg: MessageEvent) => {
      try {
        setExtras(JSON.parse(msg.data))
      } catch (e) {}
    }

    return ws.close
  }, [playerId, roomId])

  const sendToEveryone = (message: {}) => {
    try {
      wsClient?.send(JSON.stringify({ room: roomId, ...message }))
    } catch (e) {}
  }

  return [extras, sendToEveryone]
}
