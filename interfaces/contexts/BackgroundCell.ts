export interface BackgrounCell {
  backgroundCell: Cell
  setBackgroundCell: (cell: Cell) => boolean
}

export interface Cell {
  type: string
  value: string[] | string
}
