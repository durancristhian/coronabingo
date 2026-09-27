export type AnalyticsLanguage = 'en' | 'es'
export type AnalyticsFirstUse = 'no' | 'yes'
export type AnalyticsBackgroundKey =
  | 'blue'
  | 'clippy'
  | 'covid_19'
  | 'cremona'
  | 'custom_url'
  | 'frameworks'
  | 'ghana_pallbearers'
  | 'green'
  | 'kun_aguero'
  | 'multicolor'
  | 'orange'
  | 'pikachu'
  | 'pokemon'
  | 'yellow'
export type AnalyticsBackgroundSource = 'custom_url' | 'preset'
export type AnalyticsPageType =
  | 'home'
  | 'not_found'
  | 'player_card'
  | 'room_lobby'
  | 'room_setup'
export type AnalyticsSoundCatalog = 'extra' | 'standard'
export type AnalyticsSoundKey =
  | 'cardi_b_coronavirus'
  | 'chino_cirujano_pagaraprata'
  | 'friends_ready_to_rumble'
  | 'ghana_pallbearers'
  | 'guido_mira_la_repe'
  | 'guido_preparado_listo_ya'
  | 'kun_aguero_ojo_al_tejo'
  | 'patao_carton'
  | 'patao_coronabingo'
  | 'patao_ese_bolillero'
  | 'patao_linea'
  | 'riverito_cruzar_dedos'
  | 'simpsons_bingo'
  | 'simpsons_hundiste_acorazado'
  | 'susana_correctou'
  | 'tano_pasman_no'
  | 'the_office_no_god_no'
  | 'the_office_this_is_the_worst'
  | 'windows_error'

interface AnalyticsEventContext {
  schema_version: 'v1'
  ui_language: AnalyticsLanguage
}

export interface AnalyticsEventMap {
  background_selected: AnalyticsEventContext & {
    background_key: AnalyticsBackgroundKey
    background_source: AnalyticsBackgroundSource
  }
  celebration_used: AnalyticsEventContext & {
    celebration_type: 'balloons' | 'confetti' | 'pallbearers'
    first_use_in_play: AnalyticsFirstUse
    play_number: number
  }
  language_changed: AnalyticsEventContext & {
    from_language: AnalyticsLanguage
    page_type: AnalyticsPageType
    to_language: AnalyticsLanguage
  }
  no_local_storage_support: AnalyticsEventContext & {
    description: string
  }
  player_card_opened: AnalyticsEventContext & {
    background_key: AnalyticsBackgroundKey
    background_source: AnalyticsBackgroundSource
    play_number: number
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
  sound_used: AnalyticsEventContext & {
    first_use_in_play: AnalyticsFirstUse
    play_number: number
    sound_catalog: AnalyticsSoundCatalog
    sound_key: AnalyticsSoundKey
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
