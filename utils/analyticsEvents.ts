import {
  AnalyticsBackgroundKey,
  AnalyticsBackgroundSource,
  AnalyticsEventMap,
  AnalyticsFirstUse,
  AnalyticsLanguage,
  AnalyticsPageType,
  AnalyticsSoundCatalog,
  AnalyticsSoundKey,
} from '~/interfaces/analytics/Events'

const getAnalyticsLanguage = (language: string): AnalyticsLanguage =>
  language === 'en' ? 'en' : 'es'

const getEventContext = (language: string) => ({
  schema_version: 'v1' as const,
  ui_language: getAnalyticsLanguage(language),
})

const getRoomCreatedDate = (createdAt: Date) =>
  createdAt.toISOString().slice(0, 10)

export const getRoomCreatedEventParams = (
  language: string,
  createdAt: Date,
): AnalyticsEventMap['room_created'] => ({
  ...getEventContext(language),
  room_created_date: getRoomCreatedDate(createdAt),
})

interface RoomStartedEventOptions {
  createdAt: Date
  hideNumbersMeaning: boolean
  language: string
  playNumber: number
  playerCount: number
  usesOnlineSpinner: boolean
}

export const getRoomStartedEventParams = ({
  createdAt,
  hideNumbersMeaning,
  language,
  playNumber,
  playerCount,
  usesOnlineSpinner,
}: RoomStartedEventOptions): AnalyticsEventMap['room_started'] => ({
  ...getEventContext(language),
  number_meanings: hideNumbersMeaning ? 'hidden' : 'shown',
  play_kind: playNumber === 1 ? 'first_play' : 'replay',
  play_number: playNumber,
  player_count: playerCount,
  room_created_date: getRoomCreatedDate(createdAt),
  spinner_mode: usesOnlineSpinner ? 'online' : 'physical',
})

interface RoomRestartedEventOptions {
  createdAt: Date
  language: string
  playNumber: number
}

export const getRoomRestartedEventParams = ({
  createdAt,
  language,
  playNumber,
}: RoomRestartedEventOptions): AnalyticsEventMap['room_restarted'] => ({
  ...getEventContext(language),
  first_restart: playNumber === 1 ? 'yes' : 'no',
  restart_number: playNumber,
  room_created_date: getRoomCreatedDate(createdAt),
})

export const getNoLocalStorageEventParams = (
  language: string,
): AnalyticsEventMap['no_local_storage_support'] => ({
  ...getEventContext(language),
  description: 'false',
})

const pageTypesByPathname: Record<string, AnalyticsPageType> = {
  '/': 'home',
  '/room/[roomId]': 'room_lobby',
  '/room/[roomId]/[playerId]': 'player_card',
  '/room/[roomId]/admin': 'room_setup',
}

export const getAnalyticsPageType = (pathname: string): AnalyticsPageType =>
  pageTypesByPathname[pathname] || 'not_found'

interface LanguageChangedEventOptions {
  fromLanguage: string
  pathname: string
  toLanguage: string
}

export const getLanguageChangedEventParams = ({
  fromLanguage,
  pathname,
  toLanguage,
}: LanguageChangedEventOptions): AnalyticsEventMap['language_changed'] => ({
  ...getEventContext(toLanguage),
  from_language: getAnalyticsLanguage(fromLanguage),
  page_type: getAnalyticsPageType(pathname),
  to_language: getAnalyticsLanguage(toLanguage),
})

export const getTutorialEventParams = (
  language: string,
): AnalyticsEventMap['tutorial_opened'] => {
  const tutorialLanguage = getAnalyticsLanguage(language)

  return {
    ...getEventContext(tutorialLanguage),
    tutorial_language: tutorialLanguage,
    tutorial_provider: 'self_hosted',
    tutorial_version: '2026-10-v1',
  }
}

interface BackgroundEventOptions {
  backgroundKey: AnalyticsBackgroundKey
  backgroundSource: AnalyticsBackgroundSource
  language: string
}

export const getBackgroundSelectedEventParams = ({
  backgroundKey,
  backgroundSource,
  language,
}: BackgroundEventOptions): AnalyticsEventMap['background_selected'] => ({
  ...getEventContext(language),
  background_key: backgroundKey,
  background_source: backgroundSource,
})

interface PlayerCardOpenedEventOptions extends BackgroundEventOptions {
  playNumber: number
}

export const getPlayerCardOpenedEventParams = ({
  backgroundKey,
  backgroundSource,
  language,
  playNumber,
}: PlayerCardOpenedEventOptions): AnalyticsEventMap['player_card_opened'] => ({
  ...getEventContext(language),
  background_key: backgroundKey,
  background_source: backgroundSource,
  play_number: playNumber,
})

const playerCardOpenedFallback = new Set<string>()
const playerCardOpenedStoragePrefix =
  'coronabingo:analytics:player-card-opened:v1'

export const markPlayerCardOpened = (
  roomId: string,
  playerId: string,
  playNumber: number,
) => {
  const key = `${playerCardOpenedStoragePrefix}:${roomId}:${playerId}:${playNumber}`

  if (typeof window !== 'undefined') {
    try {
      if (window.localStorage.getItem(key)) return false

      window.localStorage.setItem(key, '1')
      return true
    } catch {
      // Fall back to in-memory deduplication when storage is unavailable.
    }
  }

  if (playerCardOpenedFallback.has(key)) return false

  playerCardOpenedFallback.add(key)
  return true
}

type FirstUseEventName = 'celebration_used' | 'sound_used'

const firstUseFallback = new Set<string>()
const firstUseStoragePrefix = 'coronabingo:analytics:first-use:v1'

export const markFirstAnalyticsUseInPlay = (
  eventName: FirstUseEventName,
  roomId: string,
  playNumber: number,
): AnalyticsFirstUse => {
  const key = `${firstUseStoragePrefix}:${eventName}:${roomId}:${playNumber}`

  if (typeof window !== 'undefined') {
    try {
      if (window.sessionStorage.getItem(key)) return 'no'

      window.sessionStorage.setItem(key, '1')
      return 'yes'
    } catch {
      // Fall back to in-memory deduplication when storage is unavailable.
    }
  }

  if (firstUseFallback.has(key)) return 'no'

  firstUseFallback.add(key)
  return 'yes'
}

interface CelebrationUsedEventOptions {
  celebrationType: 'balloons' | 'confetti' | 'pallbearers'
  firstUseInPlay: AnalyticsFirstUse
  language: string
  playNumber: number
}

export const getCelebrationUsedEventParams = ({
  celebrationType,
  firstUseInPlay,
  language,
  playNumber,
}: CelebrationUsedEventOptions): AnalyticsEventMap['celebration_used'] => ({
  ...getEventContext(language),
  celebration_type: celebrationType,
  first_use_in_play: firstUseInPlay,
  play_number: playNumber,
})

interface SoundUsedEventOptions {
  firstUseInPlay: AnalyticsFirstUse
  language: string
  playNumber: number
  soundCatalog: AnalyticsSoundCatalog
  soundKey: AnalyticsSoundKey
}

export const getSoundUsedEventParams = ({
  firstUseInPlay,
  language,
  playNumber,
  soundCatalog,
  soundKey,
}: SoundUsedEventOptions): AnalyticsEventMap['sound_used'] => ({
  ...getEventContext(language),
  first_use_in_play: firstUseInPlay,
  play_number: playNumber,
  sound_catalog: soundCatalog,
  sound_key: soundKey,
})
