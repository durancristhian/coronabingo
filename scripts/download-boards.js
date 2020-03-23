const { writeFileSync } = require('fs')
const { getWorksheet } = require('gsheets')
const fetch = require('isomorphic-unfetch')
const { join } = require('path')

const downloadBoards = async () => {
  const worksheet = await getWorksheet(
    process.env.WOORKSHEET_ID,
    process.env.WORKSHEET_TITLE,
  )
  const boards = worksheet.data.map(Object.values)

  writeFileSync(
    join(__dirname, '../public', 'boards.json'),
    JSON.stringify(boards, null, 2)
  )
}

downloadBoards()
