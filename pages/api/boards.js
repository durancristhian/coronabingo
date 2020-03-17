import getRandomRotation from '../../helpers/getRandomRotation'
import boards from '../../public/boards.json'

const getBoard = index => {
  const numbers = boards[index]
  const rotations = numbers.map(number => number && getRandomRotation())

  return {
    id: index + 1,
    numbers,
    rotations
  }
}

export default (req, res) => {
  const queryParams = req.query.ids
  let [firstBoardIndex, secondBoardIndex] = queryParams.split(',').map(Number)

  firstBoardIndex--
  secondBoardIndex--

  const result = JSON.stringify(
    {
      boards: [getBoard(firstBoardIndex), getBoard(secondBoardIndex)]
    },
    null,
    2
  )
  console.log(result)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(result))
}
