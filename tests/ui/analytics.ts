import { Page } from '@playwright/test'
import { ANALYTICS_TEST_STORAGE_KEY } from '../../utils/gtag'

export interface CapturedAnalyticsTestEvent {
  eventName: string
  eventParams: Record<string, number | string>
}

export async function readAnalyticsEvents(
  page: Page,
): Promise<CapturedAnalyticsTestEvent[]> {
  return page.evaluate((storageKey): CapturedAnalyticsTestEvent[] => {
    return JSON.parse(window.sessionStorage.getItem(storageKey) || '[]')
  }, ANALYTICS_TEST_STORAGE_KEY)
}
