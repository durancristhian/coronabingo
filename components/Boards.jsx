import Cells from './Cells'

export default function Boards({ boards }) {
  return boards.map((board, i) => (
    <div className="bg-white my-8 p-4 shadow-2xl" key={i}>
      <p className="font-semibold">CARTÓN Nº {board.id}</p>
      <div className="border-l-2 border-t-2 border-black flex flex-wrap mt-1">
        <Cells {...board} />
      </div>
    </div>
  ))
}
