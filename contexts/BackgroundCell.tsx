import React, { createContext, ReactNode, useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { BackgrounCell, Cell } from '~/interfaces/contexts/BackgroundCell'
import {
  getPlayerCardOpenedEventParams,
  markPlayerCardOpened,
} from '~/utils/analyticsEvents'
import { getBackgroundAnalyticsValue } from '~/utils/backgroundAnalytics'
import { BACKGROUND_CELL_VALUES } from '~/utils/constants'
import { logEvent as log } from '~/utils/gtag'

const defaultContextValue = {
  type: BACKGROUND_CELL_VALUES[0].type,
  value: BACKGROUND_CELL_VALUES[0].value,
}
const BackgroundCellContext = createContext<BackgrounCell>({
  backgroundCell: defaultContextValue,
  setBackgroundCell: () => false,
})

const isBackgroundCell = (value: unknown): value is Cell => {
  if (!value || typeof value !== 'object') return false

  const cell = value as Partial<Cell>
  return (
    typeof cell.type === 'string' &&
    (typeof cell.value === 'string' ||
      (Array.isArray(cell.value) &&
        cell.value.every(item => typeof item === 'string')))
  )
}

const readStoredBackgrounds = (): Record<string, unknown> => {
  const storedBackgrounds = JSON.parse(
    window.localStorage.getItem('backgroundCell') || '{}',
  )

  return storedBackgrounds &&
    typeof storedBackgrounds === 'object' &&
    !Array.isArray(storedBackgrounds)
    ? storedBackgrounds
    : {}
}

interface Props {
  children: ReactNode
  playNumber: number
  playerId: string
  roomId: string
  trackCardOpened: boolean
}

const BackgroundCellContextProvider = ({
  children,
  playNumber,
  playerId,
  roomId,
  trackCardOpened,
}: Props) => {
  const { lang } = useTranslation()
  const [backgroundCell, setBackgroundCellState] = useState<Cell>(
    defaultContextValue,
  )

  useEffect(() => {
    let selectedBackground: Cell = defaultContextValue

    try {
      const storedBackground = readStoredBackgrounds()[playerId]
      if (isBackgroundCell(storedBackground)) {
        selectedBackground = storedBackground
      }
    } catch {}

    setBackgroundCellState(selectedBackground)

    if (trackCardOpened && markPlayerCardOpened(roomId, playerId, playNumber)) {
      log(
        'player_card_opened',
        getPlayerCardOpenedEventParams({
          ...getBackgroundAnalyticsValue(selectedBackground),
          language: lang,
          playNumber,
        }),
      )
    }
  }, [lang, log, playNumber, playerId, roomId, trackCardOpened])

  const saveAndSetBackgroundCell = (selectedBackground: Cell) => {
    setBackgroundCellState(selectedBackground)

    try {
      const storedBackgrounds = readStoredBackgrounds()

      window.localStorage.setItem(
        'backgroundCell',
        JSON.stringify({
          ...storedBackgrounds,
          [playerId]: selectedBackground,
        }),
      )
      return true
    } catch {
      return false
    }
  }

  return (
    <BackgroundCellContext.Provider
      value={{ backgroundCell, setBackgroundCell: saveAndSetBackgroundCell }}
    >
      {children}
    </BackgroundCellContext.Provider>
  )
}

export { BackgroundCellContext, BackgroundCellContextProvider }
