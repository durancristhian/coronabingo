import { PageData } from '~/interfaces'

/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const pdfParse = require('pdf-parse')

const createEmptyArray = () => new Array(9).fill(null)

const buildTickets = (numbers: number[]) => {
  let ticketNumber = 0
  let lineNumber = 0

  return JSON.stringify(
    numbers.reduce((acc: number[][][], number) => {
      if (!acc[ticketNumber]) {
        acc[ticketNumber] = [
          createEmptyArray(),
          createEmptyArray(),
          createEmptyArray(),
        ]
      }

      let index = Math.floor(number / 10)
      if (index > acc[ticketNumber][lineNumber].length - 1) {
        index--
      }

      acc[ticketNumber][lineNumber][index] = number

      if (acc[ticketNumber][lineNumber].filter(n => n).length === 5) {
        lineNumber = lineNumber + 1

        if (lineNumber === 3) {
          ticketNumber = ticketNumber + 1
          lineNumber = 0
        }
      }

      return acc
    }, []),
  )
}

const renderPage = (pageData: PageData) => {
  const renderOptions = {
    normalizeWhitespace: true,
  }

  return pageData
    .getTextContent(renderOptions)
    .then(textContent => textContent.items)
    .then(items => items.filter(({ str }) => str !== 'www.bingo.es'))
    .then(items => items.map(({ str }) => Number(str)))
    .then(numbers => buildTickets(numbers))
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

const flat = (array: [][]) =>
  array.reduce((acc: [][], curr) => acc.concat(...curr), [])

const pdfNames = [...Array(24).keys()].map(n => n + 1)

Promise.all(
  pdfNames.map(async pdfName => {
    const pdfPath = join(__dirname, 'tickets', `${pdfName}.pdf`)

    console.log(`📄 Generating tickets from ${pdfPath}`)

    const pdf = readFileSync(pdfPath)

    try {
      const { text } = await pdfParse(pdf, {
        pagerender: renderPage,
      })

      return text
        .split('\n')
        .filter((x: string) => x)
        .map((page: string) => JSON.parse(page).map(flat))
    } catch (e) {
      throw new Error(e.message)
    }
  }),
).then(tickets => {
  try {
    const flattedTickets = flat(tickets)

    writeFileSync(
      join(__dirname, '..', 'public', 'tickets.json'),
      JSON.stringify(flattedTickets, null, 2),
    )

    console.log(`✅ Tickets generated successfully`)
  } catch (e) {
    throw new Error(e.message)
  }
})

export {}
