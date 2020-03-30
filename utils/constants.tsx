const knuthShuffle = require('knuth-shuffle').knuthShuffle

export const BACKGROUND_CELL_VALUES = [
  { name: 'Amarillito', type: 'color', value: 'bg-yellow-300' },
  { name: 'Azulcito', type: 'color', value: 'bg-blue-300' },
  { name: 'Naranjita', type: 'color', value: 'bg-orange-300' },
  { name: 'Verdecito', type: 'color', value: 'bg-green-300' },
  { name: 'Pikachu', type: 'img', value: 'pikachu.jpg' },
  { name: 'Cremona', type: 'img', value: 'cremona.jpg' },
  { name: 'Coronavirus', type: 'img', value: 'coronavirus.gif' }
]
export const BALL_COLORS = ['blue', 'green', 'red', 'yellow']
export const BOARD_NUMBERS = [...Array(90).keys()].map(n => n + 1)
export const BOARD_NUMBER_COLOR = BOARD_NUMBERS.map(
  () => knuthShuffle(BALL_COLORS.slice(0))[0]
)
export const DREAMS = [
  'Los Huevos 🥚🥚', // 00
  'Agua 💦', // 01
  'El Niño 👦🏻', // 02
  'San Cono 🙏🔺', // 03
  'La Cama 🛏️', // 04
  'El Gato 🐈', // 05
  'El Perro 🐕', // 06
  'El Revolver 🔫', // 07
  'El Incendio 🔥🏢🔥', // 08
  'El Arroyo 🏞️', // 09
  'La leche 🍼', // 10
  'El Palito 🥢', // 11
  'El Soldado 👮🏻', // 12
  'La yeta 🥶', // 13
  'El Borracho 🥴', // 14
  'La Niña bonita 👩🏻', // 15
  'El Anillo 💍', // 16
  'La Desgracia 📵🤬', // 17
  'La Sangre 🆎➕', // 18
  'El Pescado 🐠', // 19
  'La fiesta 🥳🎊', // 20
  'La mujer 💁🏻‍', // 21
  'El loco 🤪', // 22
  'La Mariposa 🦋', // 23
  'El Caballo 🐎', // 24
  'La Gallina 🐔', // 25
  'La misa 💒', // 26
  'El peine 🕳️', // 27
  'El cerro ⛰️', // 28
  'San Pedro 🧙‍', // 29
  'Santa Rosa 🦸⛈️', // 30
  'La luz 💡', // 31
  'El Dinero 💰', // 32
  'Cristo 🧙🏿‍', // 33
  'La Cabeza 🤯', // 34
  'El Pajarito 🐦', // 35
  'La Manteca ⚪', // 36
  'El Dentista 😷🦷', // 37
  'El Aceite 🛢', // 38
  'La Lluvia 🌧️', // 39
  'El Cura 😇', // 40
  'El Cuchillo 🔪', // 41
  'La Zapatilla 👟', // 42
  'El Balcón 🌇', // 43
  'La cárcel 🚫', // 44
  'El vino 🍷', // 45
  'Los Tomates 🍅🍅', // 46
  'El Muerto 🧟', // 47
  'El Muerto habla 🧟💬', // 48
  'La carne 🥩', // 49
  'El pan 🍞', // 50
  'El Serrucho 🧰', // 51
  'La Madre 🤱🏻', // 52
  'El barco 🚢', // 53
  'La vaca 🐄', // 54
  'Los gallegos 🧔🏻🇪🇸🧔🏻', // 55
  'La caída 😩🕳️🚶🏻', // 56
  'El Jorobado 👨🏻🐫', // 57
  'El Ahogado 👨🏻‍🦰🕳️🌊', // 58
  'La Planta 🌱', // 59
  'La Virgen 👰', // 60
  'La Escopeta 🔫💨', // 61
  'La Inundacion 🌧️🌧️', // 62
  'El Casamiento 👰🏻👸👸🏻🤴🏻🤴🏼🤵', // 63
  'El Llanto 😭', // 64
  'El Cazador 🙍🏻‍♂️🏹', // 65
  'Las Lombrices 🐉', // 66
  'La Víbora 🐍', // 67
  'Los Sobrinos 🐣🐣', // 68
  'Los Vicios 🎰💉💊🚬🍾', // 69
  'Muerto sueño ⚰️', // 70
  'Los Excrementos 💩💩', // 71
  'La Sorpresa 😱🎁', // 72
  'El Hospital 🏥', // 73
  'Los Negros 🤘🏿✊🏿', // 74
  'El Payaso 🤡', // 75
  'Las Llamas 🦙🦙', // 76
  'Las piernas 🦵🦵', // 77
  'La Ramera 🔥👄', // 78
  'El Ladrón 🛃🔗', // 79
  'La bocha ⚽', // 80
  'Las Flores 💐', // 81
  'La Pelea 🥊', // 82
  'El Mal tiempo ⛈️🌪️⛈️', // 83
  'La Iglesia ⛪', // 84
  'La Linterna 🔦', // 85
  'El Humo 💨', // 86
  'Los Piojos 🐜🎸🐜', // 87
  'El Papa 👳‍♂️', // 88
  'La rata 🐀', // 89
  'El miedo 🙀', // 90
  'El Excusado 🚽', // 91
  'El Médico ⚕️', // 92
  'El Enamorado 😍', // 93
  'El Cementerio 🏛️⚰️🏛️', // 94
  'Los Anteojos 🤓', // 95
  'El Marido 🤵🏻', // 96
  'La mesa', // 97
  'Lavandera', // 98
  'Hermanos' // 99
]
export const MAX_PLAYERS = 60
