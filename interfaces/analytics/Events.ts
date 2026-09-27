export type AnalyticsLanguage = 'en' | 'es'
export type AnalyticsPageType =
  | 'home'
  | 'not_found'
  | 'player_card'
  | 'room_lobby'
  | 'room_setup'

interface AnalyticsEventContext {
  schema_version: 'v1'
  ui_language: AnalyticsLanguage
}

export interface AnalyticsEventMap {
  language_changed: AnalyticsEventContext & {
    from_language: AnalyticsLanguage
    page_type: AnalyticsPageType
    to_language: AnalyticsLanguage
  }
  no_local_storage_support: AnalyticsEventContext & {
    description: string
  }
  room_created: AnalyticsEventContext & {
    room_created_date: string
  }
  room_restarted: AnalyticsEventContext & {
    first_restart: 'no' | 'yes'
    restart_number: number
    room_created_date: string
  }
  room_started: AnalyticsEventContext & {
    number_meanings: 'hidden' | 'shown'
    play_kind: 'first_play' | 'replay'
    play_number: number
    player_count: number
    room_created_date: string
    spinner_mode: 'online' | 'physical'
  }
  tutorial_begin: AnalyticsEventContext & {
    tutorial_language: AnalyticsLanguage
    tutorial_provider: 'youtube'
  }
  tutorial_complete: AnalyticsEventContext & {
    tutorial_language: AnalyticsLanguage
    tutorial_provider: 'youtube'
  }
  tutorial_error: AnalyticsEventContext & {
    tutorial_language: AnalyticsLanguage
    tutorial_provider: 'youtube'
  }
  tutorial_opened: AnalyticsEventContext & {
    tutorial_language: AnalyticsLanguage
    tutorial_provider: 'youtube'
  }
}

export type AnalyticsEventName = keyof AnalyticsEventMap

export type AnalyticsLog = <EventName extends AnalyticsEventName>(
  eventName: EventName,
  eventParams: AnalyticsEventMap[EventName],
) => void

export type CapturedAnalyticsEvent = {
  [EventName in AnalyticsEventName]: {
    eventName: EventName
    eventParams: AnalyticsEventMap[EventName]
  }
}[AnalyticsEventName]
