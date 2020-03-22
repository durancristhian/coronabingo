import { Fragment } from 'react'
import Cells from './Cells'

export interface IBoard {
  id: string
  numbers: number[]
}

export default function Boards({ boards }: { boards: IBoard[] }) {
  return (
    <Fragment>
      {boards.map((board, i) => (
        <div
          key={i}
          className="bg-white mt-8 p-4 border-2 border-gray-900 shadow"
        >
          <p className="font-semibold">CARTÓN Nº {board.id}</p>
          <div className="border-l-2 border-t-2 border-gray-900 flex flex-wrap mt-2">
            <Cells numbers={board.numbers} />
          </div>
        </div>
      ))}
    </Fragment>
  )
}
