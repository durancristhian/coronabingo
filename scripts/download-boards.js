const fetch = require('isomorphic-unfetch')
const { writeFileSync } = require('fs')
const { getWorksheet } = require('gsheets')
const { join } = require('path')

const downloadBoards = async () => {
  const worksheet = await getWorksheet(
    '1lJCLVoQKilrNWuxl04GIg-r2My-bNVaxS1uwZCkC1Mw',
    'cartones'
  )
  const boards = worksheet.data.map(Object.values)

  writeFileSync(
    join(__dirname, '../public', 'boards.json'),
    JSON.stringify(boards, null, 2)
  )
}

downloadBoards()
