/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync } = require('fs')
const { join } = require('path')
const pdfParse = require('pdf-parse')

/* TODO: move to ~/interfaces */
interface PDFData {
  text: string
}

// @ts-ignore
const renderPage = pageData => {
  const render_options = {
    normalizeWhitespace: true,
  }

  // @ts-ignore
  return pageData.getTextContent(render_options).then(textContent => {
    let lastY
    let text = ''

    for (const item of textContent.items) {
      console.log(item.str)

      if (lastY == item.transform[5] || !lastY) {
        text += item.str
      } else {
        text += '\n' + item.str
      }

      lastY = item.transform[5]
    }

    return text
  })
}

const pdfNames = [1 /* , 2, 3, 4 */]

pdfNames.map(async pdfName => {
  const pdf = readFileSync(join(__dirname, 'boards', `${pdfName}.pdf`))

  try {
    const { text } = await pdfParse(pdf, {
      pagerender: renderPage,
    })

    /* console.log(text) */
  } catch (error) {
    throw new Error(error.message)
  }
})

export {}
