/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('node:assert/strict')
const http = require('node:http')
const { spawn } = require('node:child_process')
const { existsSync } = require('node:fs')
const { test } = require('node:test')
const { chromium } = require('@playwright/test')
const { openInteractiveBrowser } = require('../../scripts/ui-test-runtime')

test(
  'interactive browser confines requests and popups to owned origins and closes with its last tab',
  {
    skip:
      !existsSync(chromium.executablePath()) &&
      'Install Chromium to run browser isolation checks',
  },
  async t => {
    let foreignHits = 0
    async function serve(handler) {
      const server = http.createServer(handler)
      await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
      t.after(() => new Promise(resolve => server.close(resolve)))
      return {
        port: server.address().port,
        url: `http://127.0.0.1:${server.address().port}`,
      }
    }
    const app = await serve((_, response) =>
      response.end('<!doctype html><title>local</title>'),
    )
    const emulator = await serve((_, response) =>
      response.end('local emulator'),
    )
    const foreign = await serve((_, response) => {
      foreignHits++
      response.end('foreign service')
    })
    const browser = await openInteractiveBrowser({
      baseURL: app.url,
      firestorePort: emulator.port,
      headless: true,
    })
    t.after(() => browser.close())
    const context = browser.contexts()[0]
    const page = context.pages()[0]
    assert.equal(
      await page.evaluate(async url => {
        try {
          await fetch(url)
          return false
        } catch {
          return true
        }
      }, foreign.url),
      true,
    )
    const popup = await context.newPage()
    await assert.rejects(popup.goto(foreign.url), /ERR_BLOCKED_BY_CLIENT/)
    assert.equal(foreignHits, 0)
    assert.equal(
      await page.evaluate(
        async url => (await fetch(url, { mode: 'no-cors' })).type,
        emulator.url,
      ),
      'opaque',
    )
    await popup.close()
    const disconnected = new Promise(resolve =>
      browser.once('disconnected', resolve),
    )
    await page.close()
    await disconnected
    assert.equal(browser.isConnected(), false)
  },
)

for (const signal of ['SIGINT', 'SIGTERM']) {
  test(
    `interactive browser leaves ${signal} cleanup to its owning runner`,
    {
      skip: !existsSync(chromium.executablePath()) && 'Install Chromium',
      timeout: 15_000,
    },
    async t => {
      const child = spawn(
        process.execPath,
        [
          '-e',
          `
      const http = require('node:http')
      const { openInteractiveBrowser } = require(${JSON.stringify(
        require.resolve('../../scripts/ui-test-runtime'),
      )})
      const interrupted = new Promise(resolve => process.on('${signal}', resolve))
      const server = http.createServer((_, response) => response.end('local'))
      server.listen(0, '127.0.0.1', async () => {
        const browser = await openInteractiveBrowser({
          baseURL: 'http://127.0.0.1:' + server.address().port,
          firestorePort: server.address().port,
          headless: true,
        })
        process.send('ready')
        try { await interrupted } finally {
          await browser.close()
          await new Promise(resolve => setTimeout(resolve, 200))
          server.close()
          process.send('cleaned')
          process.disconnect()
        }
      })
    `,
        ],
        { stdio: ['ignore', 'ignore', 'inherit', 'ipc'] },
      )
      t.after(() => {
        if (child.exitCode === null) child.kill('SIGKILL')
      })
      const messages = []
      child.on('message', message => messages.push(message))
      const exited = new Promise(resolve => child.once('exit', resolve))
      await new Promise((resolve, reject) => {
        child.once('message', resolve)
        child.once('error', reject)
        child.once('exit', code =>
          reject(new Error(`Exited before ready: ${code}`)),
        )
      })
      child.kill(signal)
      await exited
      assert.deepEqual(messages, ['ready', 'cleaned'])
    },
  )
}
