export const BACKGROUND_CELL_VALUES = [
  { name: 'Amarillito', type: 'color', value: 'bg-yellow-400' },
  { name: 'Azulcito', type: 'color', value: 'bg-blue-400' },
  { name: 'Naranjita', type: 'color', value: 'bg-orange-400' },
  { name: 'Verdecito', type: 'color', value: 'bg-green-400' },
  { name: 'Pikachu', type: 'img', value: 'pikachu.jpg' },
  { name: 'Cremona', type: 'img', value: 'cremona.jpg' },
  { name: 'Coronavirus', type: 'img', value: 'coronavirus.gif' }
]
export const BOARD_NUMBERS = [...Array(90).keys()].map(n => n + 1)
export const MAX_PLAYERS = 60
