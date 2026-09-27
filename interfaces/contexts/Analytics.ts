import { AnalyticsEventParams } from '~/utils/gtag'

export interface AnalyticsContextData {
  log: (eventName: string, eventParams?: AnalyticsEventParams) => void
}
