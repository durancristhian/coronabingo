import { Fragment } from 'react'
import useSWR from 'swr'
import fetcher from '~/utils/fetcher'
import Cells from './Cells'

interface IProps {
  boards: string
  selectedNumbers: number[]
}

export default function Boards({ boards, selectedNumbers }: IProps) {
  const url = `/api/boards?cartones=${boards}`
  const { data, error } = useSWR<IBoard>(url, fetcher)

  /* TODO: this is not the best, improve */
  if (error || !data) return null

  return (
    <Fragment>
      {data.boards.map((board, i) => (
        <div
          key={i}
          className="bg-white mt-8 p-4 border-2 border-gray-900 shadow"
        >
          <p className="font-semibold">CARTÓN Nº {board.id}</p>
          <div className="border-l-2 border-t-2 border-gray-900 flex flex-wrap mt-2">
            <Cells
              boardNumbers={board.numbers}
              selectedNumbers={selectedNumbers}
            />
          </div>
        </div>
      ))}
    </Fragment>
  )
}

interface IBoard {
  boards: {
    id: number
    numbers: number[]
  }[]
}
