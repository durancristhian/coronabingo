/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const pdfParse = require('pdf-parse')

/* TODO: move to ~/interfaces */
interface RenderOptions {
  normalizeWhitespace: boolean
}

interface Cell {
  str: string
}

interface TextContent {
  items: Cell[]
}

interface PageData {
  getTextContent: (options: RenderOptions) => Promise<TextContent>
}

const createEmptyArray = () => new Array(9).fill(null)

const buildBoards = (numbers: number[]) => {
  let boardNumber = 0
  let lineNumber = 0

  return numbers.reduce((acc: number[][][], number) => {
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
  }, [])
}

const renderPage = (pageData: PageData) => {
  const renderOptions = {
    normalizeWhitespace: true,
  }

  /* TODO: use await */
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

const pdfNames = ['1', '2', '3', '4']

/* TODO: use await */
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
        .map((page: string) => {
          return page.split(',').map(n => (n ? Number(n) : null))
        })
    } catch (error) {
      throw new Error(error.message)
    }
  }),
).then(boards => {
  try {
    writeFileSync(
      /* TODO: update name */
      join(__dirname, '..', 'public', 'boards2.json'),
      JSON.stringify(boards, null, 2),
    )
  } catch (error) {
    throw new Error(error.message)
  }
})

export {}
