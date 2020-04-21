export interface Board {
  id: number
  numbers: BoardNumbers
}

export type BoardNumbers = (number | null)[]
