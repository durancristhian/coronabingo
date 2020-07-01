import React from 'react'
import { AnalyticsContext } from '~/contexts/Analytics'

export function useAnalytics() {
  const { log } = React.useContext(AnalyticsContext)

  return log
}
