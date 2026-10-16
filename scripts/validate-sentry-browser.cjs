/* Offline minified-browser proof. All requests are fulfilled or blocked locally. */
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const webpack = require('webpack')
const ts = require('typescript')
const { chromium, webkit } = require('@playwright/test')

async function main(engine) {
  const temporary = await fs.mkdtemp(
    path.join(os.tmpdir(), 'coronabingo-sentry-'),
  )
  let browser
  try {
    const source = await fs.readFile(
      path.join(__dirname, '../utils/sentry.ts'),
      'utf8',
    )
    await fs.writeFile(
      path.join(temporary, 'filter.js'),
      ts.transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.ESNext,
        },
      }).outputText,
    )
    await fs.writeFile(
      path.join(temporary, 'entry.js'),
      `
      import * as Sentry from '@sentry/browser';
      import { createBeforeSend } from './filter';
      const filter = createBeforeSend();
      window.applicationWrapper = callback => { const result = callback(); window.applicationFrameReturned = true; return result; };
      class Transport {
        sendEvent(event) { console.log(JSON.stringify({ sent: event })); return Promise.resolve({ status: 'success' }); }
        close() { return Promise.resolve(true); }
      }
      Sentry.init({ dsn: 'https://test@example.invalid/1', transport: Transport,
        beforeSend(event, hint) {
          const result = filter(event, hint);
          console.log(JSON.stringify({ filtered: result === null, event }));
          return result;
        }
      });
    `,
    )
    await new Promise((resolve, reject) =>
      webpack(
        {
          mode: 'production',
          target: 'web',
          entry: path.join(temporary, 'entry.js'),
          devtool: false,
          resolve: { modules: [path.resolve('node_modules')] },
          output: { path: temporary, filename: 'bundle.js' },
        },
        (error, stats) =>
          error
            ? reject(error)
            : stats.hasErrors()
            ? reject(new Error(stats.toString('errors-only')))
            : resolve(),
      ),
    )
    const bundle = await fs.readFile(path.join(temporary, 'bundle.js'), 'utf8')
    const google =
      'https://pagead2.googlesyndication.com/pagead/js/r20261015/r20190131/rum_fy2021.js'
    const observations = []
    browser = await engine.launch()
    const context = await browser.newContext({ serviceWorkers: 'block' })
    await context.route('**/*', route => {
      const url = route.request().url()
      if (url === 'https://example.invalid/bundle.js')
        return route.fulfill({
          contentType: 'application/javascript',
          body: bundle,
        })
      if (url === google)
        return route.fulfill({
          contentType: 'application/javascript',
          body: `
        function Ia() { const error = new Error(window.variant === 'message' ? 'int32' : 'int64'); if (window.variant !== 'marker') error.__closure__error__context__984382 = {severity:'warning'}; return error; }
        function wb() { throw Ia(); }
        function N() { wb(); }
        function ag() { N(); }
        function I() { ag(); }
        function ie() { if (window.variant === 'application') window.applicationWrapper(I); else I(); }
        window.addEventListener('visibilitychange', function() { ie(); });
      `,
        })
      if (url.startsWith('https://example.invalid/?variant='))
        return route.fulfill({
          contentType: 'text/html',
          body: `<script>window.variant=${JSON.stringify(
            new URL(url).searchParams.get('variant'),
          )}</script><script src="/bundle.js"></script><script src="${google}"></script><p>Offline fixture</p>`,
        })
      if (url === 'https://example.invalid/away')
        return route.fulfill({ contentType: 'text/html', body: '<p>Done</p>' })
      return route.abort('blockedbyclient')
    })
    for (const variant of ['known', 'marker', 'message', 'application']) {
      observations.length = 0
      const page = await context.newPage()
      page.on('console', message => {
        try {
          observations.push(JSON.parse(message.text()))
        } catch {}
      })
      await page.goto(`https://example.invalid/?variant=${variant}`)
      if (engine.name() === 'webkit')
        await page.goto('https://example.invalid/away')
      await page.close()
      const filtered = observations.filter(item => 'filtered' in item)
      assert.equal(filtered.length, 1, `Expected callback capture: ${variant}`)
      if (variant === 'application')
        assert.ok(
          filtered[0].event.exception.values[0].stacktrace.frames
            .slice(1)
            .some(
              frame => frame.filename === 'https://example.invalid/bundle.js',
            ),
          'Application control must keep its frame; tail-call optimization can remove a forwarding-only callback',
        )
      assert.equal(
        filtered[0].filtered,
        variant === 'known',
        `Filter result: ${variant}: ${JSON.stringify(
          filtered[0].event.exception.values[0].stacktrace.frames,
        )}`,
      )
      assert.equal(
        observations.filter(item => item.sent).length,
        variant === 'known' ? 0 : 1,
      )
    }
    console.log(
      `${engine.name()}: PASS native visibilitychange, minified SDK wrapper calibration and raw Error parsing; known failure omitted, 3 near misses sent to memory. All network intercepted.`,
    )
  } finally {
    if (browser) await browser.close()
    await fs.rm(temporary, { recursive: true, force: true })
  }
}
async function validate() {
  for (const engine of [chromium, webkit]) await main(engine)
}
validate().catch(error => {
  console.error(error)
  process.exitCode = 1
})
