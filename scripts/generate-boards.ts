/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const pdfParse = require('pdf-parse')

/* TODO: move to ~/interfaces */
interface PDFData {
  text: string
}

const createEmptyArray = () => new Array(9).fill(null)

const getBoardNumbers = (array: string[], except: string) => {
  let boardNumber = 0
  let lineNumber = 0
  return JSON.stringify(
    array
      .reduce((acc: string[][][], item: any) => {
        if (!acc[boardNumber]) {
          acc[boardNumber] = [
            createEmptyArray(),
            createEmptyArray(),
            createEmptyArray(),
          ]
        }
        if (item.str !== except) {
          let index = Math.floor(Number(item.str) / 10)
          if (index > acc[boardNumber][lineNumber].length - 1) {
            index--
          }
          acc[boardNumber][lineNumber][index] = item.str
          if (acc[boardNumber][lineNumber].filter(x => x).length === 5) {
            lineNumber = lineNumber + 1
            if (lineNumber === 3) {
              boardNumber = boardNumber + 1
              lineNumber = 0
            }
          }
        }
        return acc
      }, [])
      .map((m: any) => m.flat()),
  )
}

// @ts-ignore
const renderPage = pageData => {
  const render_options = {
    normalizeWhitespace: true,
  }
  // @ts-ignore
  return pageData
    .getTextContent(render_options)
    .then((textContent: any) =>
      getBoardNumbers(textContent.items, 'www.bingo.es'),
    )
    .catch(console.log)
}

const pdfNames = [1, 2, 3, 4]

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
        .map((page: string) => JSON.parse(page))
        .flat()
        .filter((x: []) => x.some(n => n))
    } catch (error) {
      throw new Error(error.message)
    }
  }),
).then(boards => {
  writeFileSync(
    join(__dirname, 'boards', `boards.json`),
    JSON.stringify(boards.flat()),
  )
})

export {}
