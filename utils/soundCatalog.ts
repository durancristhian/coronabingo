import {
  AnalyticsSoundCatalog,
  AnalyticsSoundKey,
} from '~/interfaces/analytics/Events'

export interface Sound {
  analyticsCatalog: AnalyticsSoundCatalog
  analyticsKey: AnalyticsSoundKey
  language: string
  name: string
  url: string
}

export const SOUNDS: Sound[] = [
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'cardi_b_coronavirus',
    name: 'Cardi B - Coronavirus',
    language: 'en',
    url: '/sounds/cardi-b/coronavirus.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'chino_cirujano_pagaraprata',
    name: 'Chino cirujano - Pero pagaraprata',
    language: 'ar',
    url: '/sounds/chino-cirujano/pero-pagaraprata.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'ghana_pallbearers',
    name: 'Ghaneses del ataúd - Ghana pallbearers',
    language: 'world',
    url: '/sounds/funeral/dance-with-the-coffin.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'friends_ready_to_rumble',
    name: "Friends - Let's get ready to rumble",
    language: 'en',
    url: '/sounds/friends/lets-get-ready-to-rumble.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'guido_mira_la_repe',
    name: 'Guido Kaczka  - Mirá la repe',
    language: 'ar',
    url: '/sounds/guido/mira-la-repe.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'guido_preparado_listo_ya',
    name: 'Guido Kaczka - Preparado, listo, ya',
    language: 'ar',
    url: '/sounds/guido/preparado-listo-ya.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'kun_aguero_ojo_al_tejo',
    name: 'Kun Agüero - Ojo al tejo',
    language: 'ar',
    url: '/sounds/kun-aguero/ojo-al-tejo.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'simpsons_hundiste_acorazado',
    name: 'Los Simpsons - Hundiste mi acorazado',
    language: 'ar',
    url: '/sounds/simpsons/hundiste-mi-acorazado.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'riverito_cruzar_dedos',
    name: 'Riverito - A cruzar los dedos',
    language: 'ar',
    url: '/sounds/riverito/cruzar-dedos.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'susana_correctou',
    name: 'Susana - Correctou',
    language: 'ar',
    url: '/sounds/susana/correctou.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'tano_pasman_no',
    name: 'Tano Pasman - Nooooo',
    language: 'ar',
    url: '/sounds/tano/nooooo.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'the_office_no_god_no',
    name: 'The Office - No, God, no',
    language: 'en',
    url: '/sounds/the-office/no-god-no.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'the_office_this_is_the_worst',
    name: 'The Office - This is the worst',
    language: 'en',
    url: '/sounds/the-office/this-is-the-worst.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'simpsons_bingo',
    name: 'The Simpsons - Bingo',
    language: 'en',
    url: '/sounds/simpsons/homer-bingo.mp3',
  },
  {
    analyticsCatalog: 'standard',
    analyticsKey: 'windows_error',
    name: 'Error de Windows - Windows Error',
    language: 'world',
    url: '/sounds/windows/windows-error.mp3',
  },
]
export const SOUNDS_EXTRAS: Sound[] = [
  ...SOUNDS,
  {
    analyticsCatalog: 'extra',
    analyticsKey: 'patao_carton',
    name: 'Patao - Cartón',
    language: 'ar',
    url: '/sounds/patao/carton.mp3',
  },
  {
    analyticsCatalog: 'extra',
    analyticsKey: 'patao_coronabingo',
    name: 'Patao - Coronabingo',
    language: 'ar',
    url: '/sounds/patao/coronabingo.mp3',
  },
  {
    analyticsCatalog: 'extra',
    analyticsKey: 'patao_ese_bolillero',
    name: 'Patao - Ese bolillero papá',
    language: 'ar',
    url: '/sounds/patao/ese-bolillero-papa.mp3',
  },
  {
    analyticsCatalog: 'extra',
    analyticsKey: 'patao_linea',
    name: 'Patao - Linea',
    language: 'ar',
    url: '/sounds/patao/linea.mp3',
  },
]
