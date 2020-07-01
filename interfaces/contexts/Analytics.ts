export interface AnalyticsContextData {
  log: (
    eventName: string,
    eventParams: Partial<firebase.analytics.EventParams>,
  ) => void
}
