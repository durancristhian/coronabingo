const knuthShuffle = require('knuth-shuffle').knuthShuffle

export const BACKGROUND_CELL_VALUES = [
  { key: 'jugar:backgrounds.yellow', type: 'color', value: 'yellow' },
  { key: 'jugar:backgrounds.blue', type: 'color', value: 'blue' },
  { key: 'jugar:backgrounds.orange', type: 'color', value: 'orange' },
  { key: 'jugar:backgrounds.green', type: 'color', value: 'green' },
  {
    key: 'jugar:backgrounds.multicolor',
    type: 'color',
    value: ['indigo', 'pink', 'purple', 'teal'],
  },
  {
    key: 'jugar:backgrounds.pikachu',
    type: 'img',
    value: 'pokemon/025.png',
  },
  {
    key: 'jugar:backgrounds.pokemon',
    type: 'img',
    value: [
      'pokemon/001.png',
      'pokemon/004.png',
      'pokemon/007.png',
      'pokemon/129.png',
    ],
  },
  {
    key: 'jugar:backgrounds.cremona',
    type: 'img',
    value: 'cremona.png',
  },
  {
    key: 'jugar:backgrounds.covid-19',
    type: 'img',
    value: 'coronavirus.gif',
  },
  {
    key: 'jugar:backgrounds.clippy',
    type: 'img',
    value: 'clippy.png',
  },
  {
    key: 'jugar:backgrounds.ghana-pallbearers',
    type: 'img',
    value: [
      'pallbearers/pallbearer.png',
      'pallbearers/pallbearer-1.png',
      'pallbearers/pallbearer-2.png',
      'pallbearers/pallbearer-3.png',
    ],
  },
  {
    key: 'jugar:backgrounds.frameworks',
    type: 'img',
    value: [
      'frameworks/react.png',
      'frameworks/angular.png',
      'frameworks/vue.png',
      'frameworks/svelte.png',
    ],
  },
]
export const BALL_COLORS = ['blue', 'green', 'red', 'yellow']
export const BOARD_NUMBERS = [...Array(90).keys()].map(n => n + 1)
export const BOARD_NUMBER_COLOR = BOARD_NUMBERS.map(
  () => knuthShuffle(BALL_COLORS.slice(0))[0],
)
export const MAX_PLAYERS = 60
/* TODO: Add Patao sounds with an easter egg */
export const SOUNDS = [
  {
    name: 'Cardi B - Coronavirus',
    language: 'en',
    url: '/sounds/cardi-b/coronavirus.mp3',
  },
  {
    name: 'Chino cirujano - Pero pagaraprata',
    language: 'ar',
    url: '/sounds/chino-cirujano/pero-pagaraprata.mp3',
  },
  {
    name:
      'Africanos bailando con el cajón - African guys dancing with the coffin',
    language: 'world',
    url: '/sounds/funeral/dance-with-the-coffin.mp3',
  },
  {
    name: "Friends - Let's get ready to rumble",
    language: 'en',
    url: '/sounds/friends/lets-get-ready-to-rumble.mp3',
  },
  {
    name: 'Guido Kaczka  - Mirá la repe',
    language: 'ar',
    url: '/sounds/guido/mira-la-repe.mp3',
  },
  {
    name: 'Guido Kaczka - Preparado, listo, ya',
    language: 'ar',
    url: '/sounds/guido/preparado-listo-ya.mp3',
  },
  {
    name: 'Los Simpsons - Hundiste mi acorazado',
    language: 'ar',
    url: '/sounds/simpsons/hundiste-mi-acorazado.mp3',
  },
  {
    name: 'Riverito - A cruzar los dedos',
    language: 'ar',
    url: '/sounds/riverito/cruzar-dedos.mp3',
  },
  {
    name: 'Susana - Correctou',
    language: 'ar',
    url: '/sounds/susana/correctou.mp3',
  },
  {
    name: 'Tano Pasman - Nooooo',
    language: 'ar',
    url: '/sounds/tano/nooooo.mp3',
  },
  {
    name: 'The Office - No, God, no',
    language: 'en',
    url: '/sounds/the-office/no-god-no.mp3',
  },
  {
    name: 'The Office - This is the worst',
    language: 'en',
    url: '/sounds/the-office/this-is-the-worst.mp3',
  },
  {
    name: 'The Simpsons - Bingo',
    language: 'en',
    url: '/sounds/simpsons/homer-bingo.mp3',
  },
  {
    name: 'Error de Windows - Windows Error',
    language: 'world',
    url: '/sounds/windows/windows-error.mp3',
  },
]
export const SOUNDS_EXTRAS = [
  ...SOUNDS,
  {
    name: 'Patao - Cartón',
    language: 'ar',
    url: '/sounds/patao/carton.mp3',
  },
  {
    name: 'Patao - Coronabingo',
    language: 'ar',
    url: '/sounds/patao/coronabingo.mp3',
  },
  {
    name: 'Patao - Ese bolillero papá',
    language: 'ar',
    url: '/sounds/patao/ese-bolillero-papa.mp3',
  },
  {
    name: 'Patao - Linea',
    language: 'ar',
    url: '/sounds/patao/linea.mp3',
  },
]
