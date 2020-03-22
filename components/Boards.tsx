import { Fragment } from 'react'
import useSWR from 'swr'
import fetcher from '~/utils/fetcher'
import Cells from './Cells'

interface IBoard {
  boards: {
    id: number
    numbers: number[]
  }[]
}

export default function Boards({ boards }: { boards: string }) {
  const url = `/api/boards?cartones=${boards}`
  const { data, error } = useSWR<IBoard>(url, fetcher)

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
            <Cells numbers={board.numbers} />
          </div>
        </div>
      ))}
    </Fragment>
  )
}
