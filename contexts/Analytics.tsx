import React, { ReactNode } from 'react'
import { AnalyticsContextData } from '~/interfaces/contexts/Analytics'
import { logEvent } from '~/utils/gtag'

interface Props {
  children: ReactNode
}

const AnalyticsContext = React.createContext<AnalyticsContextData>({
  log: logEvent,
})

const analyticsContextValue = { log: logEvent }

const AnalyticsContextProvider = ({ children }: Props) => (
  <AnalyticsContext.Provider value={analyticsContextValue}>
    {children}
  </AnalyticsContext.Provider>
)

export { AnalyticsContext, AnalyticsContextProvider }
