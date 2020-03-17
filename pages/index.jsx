import { getWorksheet } from 'gsheets'
import fetch from 'isomorphic-unfetch'
import Boards from '../components/Boards'
import getRandomInt from '../helpers/getRandomInt'
import getRandomRotation from '../helpers/getRandomRotation'

export default function Home({ boards }) {
  return <Boards boards={boards} />
}

export async function getServerSideProps() {
  const worksheet = await getWorksheet(
    process.env.spreadsheetID,
    process.env.worksheetName
  )
  const boards = worksheet.data.map(Object.values)

  const firstBoardIndex = getRandomInt(0, 59)
  const secondBoardIndex = getRandomInt(0, 59)

  const getBoard = index => {
    const numbers = boards[index]

    return {
      id: index + 1,
      numbers: numbers,
      rotations: numbers.map(number => number && getRandomRotation())
    }
  }

  return {
    props: {
      boards: [getBoard(firstBoardIndex), getBoard(secondBoardIndex)]
    }
  }
}
