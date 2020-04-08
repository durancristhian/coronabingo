const knuthShuffle = require('knuth-shuffle').knuthShuffle

export const BACKGROUND_CELL_VALUES = [
  { key: 'jugar:backgrounds.yellow', type: 'color', value: 'yellow' },
  { key: 'jugar:backgrounds.blue', type: 'color', value: 'blue' },
  { key: 'jugar:backgrounds.orange', type: 'color', value: 'orange' },
  { key: 'jugar:backgrounds.green', type: 'color', value: 'green' },
  {
    key: 'jugar:backgrounds.pikachu',
    type: 'img',
    value: 'pikachu.png',
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
]
export const BALL_COLORS = ['blue', 'green', 'red', 'yellow']
export const BOARD_NUMBERS = [...Array(90).keys()].map(n => n + 1)
export const BOARD_NUMBER_COLOR = BOARD_NUMBERS.map(
  () => knuthShuffle(BALL_COLORS.slice(0))[0],
)
export const BUTTON_COLORS = {
  green: [
    'bg-green-400',
    'border-green-600',
    'focus:bg-green-500',
    'focus:border-green-700',
    'focus:text-green-900',
    'text-green-800',
  ],
  pink: [
    'bg-pink-400',
    'border-pink-600',
    'focus:bg-pink-500',
    'focus:border-pink-700',
    'focus:text-pink-900',
    'text-pink-800',
  ],
  red: [
    'bg-red-400',
    'border-red-600',
    'focus:bg-red-500',
    'focus:border-red-700',
    'focus:text-red-900',
    'text-red-800',
  ],
  yellow: [
    'bg-yellow-400',
    'border-yellow-600',
    'focus:bg-yellow-500',
    'focus:border-yellow-700',
    'focus:text-yellow-900',
    'text-yellow-800',
  ],
}
export const MAX_PLAYERS = 60
/* TODO: Add Patao sounds with an easter egg */
export const SOUNDS = [
  {
    name: 'Cardi B - Coronavirus',
    language: '🇺🇸',
    url: '/sounds/coronavirus.mp3',
  },
  {
    name: 'Chino cirujano - Pero pagaraprata',
    language: '🇦🇷',
    url: '/sounds/chino-cirujano/pero-pagaraprata.mp3',
  },
  {
    name: "Friends - Let's get ready to rumble",
    language: '🇺🇸',
    url: '/sounds/friends/lets-get-ready-to-rumble.mp3',
  },
  {
    name: 'GTA - Ah sh*t, here we go again',
    language: '🇺🇸',
    url: '/sounds/gta-ah-shit-here-we-go-again.mp3',
  },
  {
    name: 'Guido Kaczka  - Mirá la repe',
    language: '🇦🇷',
    url: '/sounds/guido/mira-la-repe.mp3',
  },
  {
    name: 'Guido Kaczka - Preparado, listo, ya',
    language: '🇦🇷',
    url: '/sounds/guido/preparado-listo-ya.mp3',
  },
  {
    name: 'Los Simpsons - Hundiste mi acorazado',
    language: '🇦🇷',
    url: '/sounds/simpsons/hundiste-mi-acorazado.mp3',
  },
  {
    name: 'Riverito - A cruzar los dedos',
    language: '🇦🇷',
    url: '/sounds/riverito/cruzar-dedos.mp3',
  },
  {
    name: 'Snoop dog!',
    language: '🇺🇸',
    url: '/sounds/snoop-dog.mp3',
  },
  {
    name: 'Susana - Correctou',
    language: '🇦🇷',
    url: '/sounds/susana/correctou.mp3',
  },
  {
    name: 'Tano Pasman - Nooooo',
    language: '🇦🇷',
    url: '/sounds/tano/nooooo.mp3',
  },
  {
    name: 'The Office - No, God, no',
    language: '🇺🇸',
    url: '/sounds/the-office/no-god-no.mp3',
  },
  {
    name: 'The Office - This is the worst',
    language: '🇺🇸',
    url: '/sounds/the-office/this-is-the-worst.mp3',
  },
  {
    name: 'The Simpsons - Bingo',
    language: '🇺🇸',
    url: '/sounds/simpsons/homer-bingo.mp3',
  },
  {
    name: 'You what?',
    language: '🇺🇸',
    url: '/sounds/you-what.mp3',
  },
  {
    name: 'Windows - Error',
    language: '🌎',
    url: '/sounds/windows/windows-error.mp3',
  },
]
export const SOUNDS_EXTRAS = [
  ...SOUNDS,
  {
    name: 'Patao - Cartón',
    language: '🇦🇷',
    url: '/sounds/patao/carton.mp3',
  },
  {
    name: 'Patao - Coronabingo',
    language: '🇦🇷',
    url: '/sounds/patao/coronabingo.mp3',
  },
  {
    name: 'Patao - Ese bolillero papá',
    language: '🇦🇷',
    url: '/sounds/patao/ese-bolillero-papa.mp3',
  },
  {
    name: 'Patao - Linea',
    language: '🇦🇷',
    url: '/sounds/patao/linea.mp3',
  },
]
