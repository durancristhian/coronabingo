import {
  AnalyticsEventMap,
  AnalyticsLanguage,
} from '~/interfaces/analytics/Events'

const getEventContext = (language: string) => ({
  schema_version: 'v1' as const,
  ui_language: (language === 'en' ? 'en' : 'es') as AnalyticsLanguage,
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
