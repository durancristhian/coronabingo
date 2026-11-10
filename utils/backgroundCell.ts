import { Cell } from '~/interfaces/contexts/BackgroundCell'

const INCLUDED_BACKGROUND_CELL_ASSETS: Record<string, string> = {
  'coronavirus.gif': 'coronavirus.28e4692f.webp',
}

export function getBackgroundCellImageUrl(value: string) {
  const asset = INCLUDED_BACKGROUND_CELL_ASSETS[value] || value

  return `/background-cells/${asset}`
}

const COLORS: Record<string, string> = {
  blue: 'bg-blue-300',
  green: 'bg-green-300',
  indigo: 'bg-indigo-300',
  orange: 'bg-orange-300',
  pink: 'bg-pink-300',
  purple: 'bg-purple-300',
  teal: 'bg-teal-300',
  yellow: 'bg-yellow-300',
}

export function getBackgroundCellAppearance({ type, value }: Cell, index = 0) {
  const selectedValue = Array.isArray(value)
    ? value[Math.abs(Math.floor(value.length * ((index / value.length) % 1)))]
    : value

  return {
    className: type === 'color' ? COLORS[selectedValue] : undefined,
    style: {
      ...(type === 'img' && {
        backgroundImage: `url(${getBackgroundCellImageUrl(selectedValue)})`,
      }),
      ...(type === 'url' && {
        backgroundImage: `url(${selectedValue})`,
      }),
    },
  }
}
