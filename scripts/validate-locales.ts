import { Locales } from '~/interfaces'

/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync, readFileSync } = require('fs')
const { join } = require('path')
const { allLanguages, defaultLanguage } = require('../i18n.json')

const localesPath = join(__dirname, '../locales')
// @ts-ignore
const objectsHaveSameKeys = (...objects) => {
  const allKeys = objects.reduce(
    (keys, object) => keys.concat(Object.keys(object)),
    [],
  )
  const union = new Set(allKeys)

  return objects.every(object => union.size === Object.keys(object).length)
}

const allLocales = allLanguages.reduce((prev: Locales, curr: string) => {
  const localePath = join(localesPath, curr)

  console.log('🗂', ' Directory', localePath)

  prev[curr] = {}

  readdirSync(join(localesPath, curr)).forEach((file: string) => {
    const filePath = join(localesPath, curr, file)

    console.log('---- ', '📄', 'File', filePath)

    prev[curr][file] = JSON.parse(readFileSync(filePath, 'utf-8'))
  })

  return prev
}, {})

const filesDefaultLanguage = allLocales[defaultLanguage]

Object.keys(allLocales)
  .filter(l => l !== defaultLanguage)
  .map(l => {
    const files = allLocales[l]
    const comparisonOfFiles = objectsHaveSameKeys(filesDefaultLanguage, files)

    console.log(comparisonOfFiles ? '✅' : '❌', defaultLanguage, l)

    if (!comparisonOfFiles) {
      throw new Error(
        `Directories locales/${defaultLanguage} and locales/${l} don't have the same amount of files`,
      )
    }

    Object.keys(files).map(k => {
      const texts = files[k]
      const comparisonOfTexts = objectsHaveSameKeys(
        filesDefaultLanguage[k],
        texts,
      )

      console.log(comparisonOfTexts ? '✅' : '❌', defaultLanguage, l, k)

      if (!comparisonOfTexts) {
        throw new Error(
          `Between languages ${defaultLanguage} and ${l}, the keys of ${k} are not the same`,
        )
      }
    })
  })

export {}
