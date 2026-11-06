import React, { createContext, ReactNode, useState } from 'react'

interface Grant {
  roomId: string
  playNumber: number
}

const RoomCodeContext = createContext<{
  grant: Grant | null
  grantAccess: (grant: Grant) => void
  revokeAccess: () => void
}>({ grant: null, grantAccess: () => undefined, revokeAccess: () => undefined })

export function RoomCodeContextProvider({ children }: { children: ReactNode }) {
  const [grant, setGrant] = useState<Grant | null>(null)
  return (
    <RoomCodeContext.Provider
      value={{
        grant,
        grantAccess: setGrant,
        revokeAccess: () => setGrant(null),
      }}
    >
      {children}
    </RoomCodeContext.Provider>
  )
}

export { RoomCodeContext }
