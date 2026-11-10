import { AnalyticsBackgroundKey } from '~/interfaces/analytics/Events'

export interface BackgroundCellOption {
  analyticsKey: Exclude<AnalyticsBackgroundKey, 'custom_url'>
  key: string
  type: string
  value: string[] | string
}

export const BACKGROUND_CELL_VALUES: BackgroundCellOption[] = [
  {
    analyticsKey: 'yellow',
    key: 'playerId:backgrounds.yellow',
    type: 'color',
    value: 'yellow',
  },
  {
    analyticsKey: 'blue',
    key: 'playerId:backgrounds.blue',
    type: 'color',
    value: 'blue',
  },
  {
    analyticsKey: 'orange',
    key: 'playerId:backgrounds.orange',
    type: 'color',
    value: 'orange',
  },
  {
    analyticsKey: 'green',
    key: 'playerId:backgrounds.green',
    type: 'color',
    value: 'green',
  },
  {
    analyticsKey: 'multicolor',
    key: 'playerId:backgrounds.multicolor',
    type: 'color',
    value: ['indigo', 'pink', 'purple', 'teal'],
  },
  {
    analyticsKey: 'pikachu',
    key: 'playerId:backgrounds.pikachu',
    type: 'img',
    value: 'pokemon/025.png',
  },
  {
    analyticsKey: 'pokemon',
    key: 'playerId:backgrounds.pokemon',
    type: 'img',
    value: [
      'pokemon/001.png',
      'pokemon/004.png',
      'pokemon/007.png',
      'pokemon/129.png',
    ],
  },
  {
    analyticsKey: 'cremona',
    key: 'playerId:backgrounds.cremona',
    type: 'img',
    value: 'cremona.png',
  },
  {
    analyticsKey: 'covid_19',
    key: 'playerId:backgrounds.covid-19',
    type: 'img',
    value: 'coronavirus.gif',
  },
  {
    analyticsKey: 'clippy',
    key: 'playerId:backgrounds.clippy',
    type: 'img',
    value: 'clippy.png',
  },
  {
    analyticsKey: 'ghana_pallbearers',
    key: 'playerId:backgrounds.ghana-pallbearers',
    type: 'img',
    value: [
      'pallbearers/pallbearer-1.png',
      'pallbearers/pallbearer-2.png',
      'pallbearers/pallbearer-3.png',
      'pallbearers/pallbearer-4.png',
    ],
  },
  {
    analyticsKey: 'frameworks',
    key: 'playerId:backgrounds.frameworks',
    type: 'img',
    value: [
      'frameworks/react.png',
      'frameworks/angular.png',
      'frameworks/vue.png',
      'frameworks/svelte.png',
    ],
  },
  {
    analyticsKey: 'kun_aguero',
    key: 'playerId:backgrounds.kun-aguero',
    type: 'img',
    value: 'kun-aguero.jpg',
  },
]
