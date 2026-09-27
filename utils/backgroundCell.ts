const INCLUDED_BACKGROUND_CELL_ASSETS: Record<string, string> = {
  'coronavirus.gif': 'coronavirus.28e4692f.webp',
}

export function getBackgroundCellImageUrl(value: string) {
  const asset = INCLUDED_BACKGROUND_CELL_ASSETS[value] || value

  return `/background-cells/${asset}`
}
