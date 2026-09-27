import {
  AnalyticsBackgroundKey,
  AnalyticsBackgroundSource,
} from '../interfaces/analytics/Events'
import { Cell } from '../interfaces/contexts/BackgroundCell'
import { BACKGROUND_CELL_VALUES } from './constants'

export interface BackgroundAnalyticsValue {
  backgroundKey: AnalyticsBackgroundKey
  backgroundSource: AnalyticsBackgroundSource
}

const valuesMatch = (left: string[] | string, right: string[] | string) =>
  left.toString() === right.toString()

export const getBackgroundAnalyticsValue = (
  backgroundCell: Cell,
): BackgroundAnalyticsValue => {
  if (backgroundCell.type === 'url' && backgroundCell.value.toString().trim()) {
    return {
      backgroundKey: 'custom_url',
      backgroundSource: 'custom_url',
    }
  }

  const preset = BACKGROUND_CELL_VALUES.find(
    option =>
      option.type === backgroundCell.type &&
      valuesMatch(option.value, backgroundCell.value),
  )

  return {
    backgroundKey: preset?.analyticsKey || 'yellow',
    backgroundSource: 'preset',
  }
}
