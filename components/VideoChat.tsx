import React, { useEffect } from 'react'

interface IProps {
  roomName: string
  playerName?: string
}

export default function VideoChat({ playerName, roomName }: IProps) {
  useEffect(() => {
    if (!roomName) return
    let api: any
    import('lib-jitsi-meet-dist/dist/external_api.min').then(
      JitsiMeetExternalAPI => {
        const domain = 'meet.jit.si'
        const options = {
          roomName: `coronabingo-${roomName}`,
          width: 400,
          height: 250,
          parentNode: document.querySelector('#meet'),
          interfaceConfigOverwrite: {
            SHOW_CHROME_EXTENSION_BANNER: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            AUTHENTICATION_ENABLE: false,
            MOBILE_APP_PROMO: false,
            TOOLBAR_BUTTONS: ['microphone', 'camera', 'fullscreen'],
            DEFAULT_REMOTE_DISPLAY_NAME: 'Coronabingoer',
            DEFAULT_LOCAL_DISPLAY_NAME: playerName || 'yo'
          }
        }
        api = new JitsiMeetExternalAPI.default(domain, options)
      }
    )
    return () => {
      api && api.dispose()
    }
  }, [roomName])

  return <div className="fixed z-20 bottom-0 right-0 m-3" id="meet" />
}
