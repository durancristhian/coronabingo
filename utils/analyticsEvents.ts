import {
  AnalyticsEventMap,
  AnalyticsLanguage,
  AnalyticsPageType,
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
    tutorial_provider: 'youtube',
  }
}
