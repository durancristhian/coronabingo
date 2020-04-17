export interface BackgrounCell {
  backgroundCell: Cell
  setBackgroundCell: (cell: Cell) => void
}

export interface Cell {
  type: string
  value: string[] | string
}
