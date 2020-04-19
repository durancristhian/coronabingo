import { PageData } from '~/interfaces'

/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const pdfParse = require('pdf-parse')

const createEmptyArray = () => new Array(9).fill(null)

const buildBoards = (numbers: number[]) => {
  let boardNumber = 0
  let lineNumber = 0

  return JSON.stringify(
    numbers.reduce((acc: number[][][], number) => {
      if (!acc[boardNumber]) {
        acc[boardNumber] = [
          createEmptyArray(),
          createEmptyArray(),
          createEmptyArray(),
        ]
      }

      let index = Math.floor(number / 10)
      if (index > acc[boardNumber][lineNumber].length - 1) {
        index--
      }

      acc[boardNumber][lineNumber][index] = number

      if (acc[boardNumber][lineNumber].filter(n => n).length === 5) {
        lineNumber = lineNumber + 1

        if (lineNumber === 3) {
          boardNumber = boardNumber + 1
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
    .then(numbers => buildBoards(numbers))
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

const flat = (array: [][]) =>
  array.reduce((acc: [][], curr) => acc.concat(...curr), [])

const pdfNames = ['1', '2', '3', '4']

Promise.all(
  pdfNames.map(async pdfName => {
    const pdf = readFileSync(join(__dirname, 'boards', `${pdfName}.pdf`))

    try {
      const { text } = await pdfParse(pdf, {
        pagerender: renderPage,
      })
      return text
        .split('\n')
        .filter((x: string) => x)
        .map((page: string) => JSON.parse(page).map(flat))
    } catch (error) {
      throw new Error(error.message)
    }
  }),
).then(boards => {
  try {
    const flattedBoards = flat(boards)

    writeFileSync(
      join(__dirname, '..', 'public', 'boards.json'),
      JSON.stringify(flattedBoards, null, 2),
    )
  } catch (error) {
    throw new Error(error.message)
  }
})

export {}
