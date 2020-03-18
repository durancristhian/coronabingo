const knuthShuffle = require('knuth-shuffle').knuthShuffle

const boardIds = []
for (let index = 0; index < 60; index++) {
  boardIds.push(index)
}

export default (req, res) => {
  const randomBoardIds = knuthShuffle(boardIds.slice(0))
  const boardsDistribution = []

  for (let index = 0; index < randomBoardIds.length; index += 2) {
    boardsDistribution.push(
      `${randomBoardIds[index]},${randomBoardIds[index + 1]}`
    )
  }

  const result = JSON.stringify({ boardsDistribution }, null, 2)
  /* console.log(result) */

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(result)
}
