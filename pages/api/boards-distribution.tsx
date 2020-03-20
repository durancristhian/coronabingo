import { NextApiRequest, NextApiResponse } from 'next'
const knuthShuffle = require('knuth-shuffle').knuthShuffle

const boardIds: number[] = []
for (let index = 0; index < 60; index++) {
  boardIds.push(index)
}

export default (_req: NextApiRequest, res: NextApiResponse) => {
  const randomBoardIds = knuthShuffle(boardIds.slice(0))
  const boardsDistribution = []

  for (let index = 0; index < randomBoardIds.length; index += 2) {
    boardsDistribution.push(
      `${randomBoardIds[index] + 1},${randomBoardIds[index + 1] + 1}`
    )
  }

  const result = JSON.stringify({ boardsDistribution }, null, 2)

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(result)
}
