import React, { ReactNode } from 'react'
import { AnalyticsContextData } from '~/interfaces/contexts/Analytics'
import { AnalyticsEventParams, logEvent } from '~/utils/gtag'

interface Props {
  children: ReactNode
}

const AnalyticsContext = React.createContext<AnalyticsContextData>({
  log: () => void 0,
})

interface Props {
  children: ReactNode
}

const AnalyticsContextProvider = ({ children }: Props) => {
  const log = (eventName: string, eventParams?: AnalyticsEventParams) => {
    logEvent(eventName, eventParams)
  }

  return (
    <AnalyticsContext.Provider value={{ log }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export { AnalyticsContext, AnalyticsContextProvider }
