/* eslint-disable @typescript-eslint/no-var-requires */
const { writeFileSync } = require('fs')
const { getWorksheet } = require('gsheets')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetch = require('isomorphic-unfetch')
const { join } = require('path')

if (!process.env.WOORKSHEET_ID || !process.env.WORKSHEET_TITLE) {
  throw new Error(
    [
      '❌',
      ' Configure "WOORKSHEET_ID" and/or "WORKSHEET_TITLE" as env var first',
    ].join(''),
  )
}

const downloadTickets = async () => {
  try {
    const worksheet = await getWorksheet(
      process.env.WOORKSHEET_ID,
      process.env.WORKSHEET_TITLE,
    )
    const tickets = worksheet.data.map(Object.values)

    writeFileSync(
      join(__dirname, '../public', 'tickets.json'),
      JSON.stringify(tickets, null, 2),
    )

    console.log('✅', ' Tickets downloaded successfully')
  } catch (e) {
    throw new Error(e)
  }
}

downloadTickets()

export {}
