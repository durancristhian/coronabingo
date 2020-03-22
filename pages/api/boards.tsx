import { NextApiRequest, NextApiResponse } from 'next'
import boards from '~/public/boards.json'

const getBoard = (index: number) => {
  const numbers = boards[index]

  return {
    id: index + 1,
    numbers
  }
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', 'application/json')

  if (typeof req.query.cartones !== 'string') {
    const badRequestReason = {
      reason: 'expected "cartones" query param to a string'
    }

    res.statusCode = 400
    res.end(badRequestReason)

    return
  }

  const queryParams = req.query.cartones
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

  res.statusCode = 200
  res.end(result)
}
