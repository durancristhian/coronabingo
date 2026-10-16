import assert from 'assert'
import { BrowserClient, Event as SentryEvent, Status } from '@sentry/browser'
import { createBeforeSend } from '../utils/sentry'
const beforeSend = createBeforeSend()
const hint = {
  originalException: Object.assign(new Error('int64'), {
    __closure__error__context__984382: { severity: 'warning' },
  }),
}

const googleScript =
  'https://pagead2.googlesyndication.com/pagead/js/r20261015/r20190131/rum_fy2021.js'
const sentryHelper = './node_modules/@sentry/browser/esm/helpers.js'

// Synthetic event: no user, room, account, or retained event identifiers.
const knownEvent = (): SentryEvent => ({
  exception: {
    values: [
      {
        type: 'Error',
        value: 'int64',
        mechanism: {
          type: 'instrument',
          handled: true,
          data: { function: 'addEventListener', target: 'EventTarget' },
        },
        stacktrace: {
          frames: [
            { filename: googleScript, function: '?' },
            { filename: googleScript, function: 'ie' },
            { filename: googleScript, function: 'I' },
            { filename: googleScript, function: 'ag', in_app: true },
            { filename: googleScript, function: 'N', in_app: true },
            { filename: googleScript, function: 'wb', in_app: true },
            { filename: googleScript, function: 'Ia', in_app: true },
          ],
        },
      },
    ],
  },
  extra: { arguments: [{ type: 'visibilitychange' }] },
})

const retained: Array<[string, SentryEvent]> = []
const retain = (name: string, change: (event: SentryEvent) => void) => {
  const event = knownEvent()
  change(event)
  retained.push([name, event])
}

retain('different message', event => {
  event.exception!.values![0].value = 'int32'
})
retain('different exception type', event => {
  event.exception!.values![0].type = 'TypeError'
})
retain('missing stack', event => {
  delete event.exception!.values![0].stacktrace
})
retain('empty stack', event => {
  event.exception!.values![0].stacktrace = { frames: [] }
})
retain('unknown frame', event => {
  event.exception!.values![0].stacktrace!.frames!.push({})
})
retain('application frame', event => {
  event.exception!.values![0].stacktrace!.frames!.push({
    filename: 'https://example.invalid/_next/static/chunks/app.js',
  })
})
retain('different Google script', event => {
  event.exception!.values![0].stacktrace!.frames![1].filename =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
})
retain('lookalike hostname', event => {
  event.exception!.values![0].stacktrace!.frames![1].filename = googleScript.replace(
    '.com/',
    '.com.example.invalid/',
  )
})
retain('only Sentry frames', event => {
  event.exception!.values![0].stacktrace!.frames = [{ filename: sentryHelper }]
})
retain('unverified minified application wrapper', event => {
  event.exception!.values![0].stacktrace!.frames!.unshift({
    filename: 'https://example.invalid/_next/static/chunks/pages/_app.js',
    function: 'r',
    lineno: 1,
    colno: 123,
  })
})
retain('changed provider call chain', event => {
  event.exception!.values![0].stacktrace!.frames![3].function = 'unknown'
})
retain('global error mechanism', event => {
  event.exception!.values![0].mechanism!.type = 'onerror'
})
retain('unhandled event', event => {
  event.exception!.values![0].mechanism!.handled = false
})
retain('different callback', event => {
  event.exception!.values![0].mechanism!.data!.function = 'setTimeout'
})
retain('missing callback data', event => {
  delete event.exception!.values![0].mechanism!.data
})
retain('different event target', event => {
  event.exception!.values![0].mechanism!.data!.target = 'XMLHttpRequest'
})
retain('different browser event', event => {
  event.extra = { arguments: [{ type: 'click' }] }
})
retain('missing browser event', event => {
  delete event.extra
})
retain('uninspectable arguments', event => {
  event.extra = { arguments: '[Array]' }
})
retain('multiple exceptions', event => {
  event.exception!.values!.push({ type: 'Error', value: 'application failure' })
})
retained.push(['message-only event', { message: 'int64' }])

const sent: SentryEvent[] = []
class RecordingTransport {
  sendEvent(event: SentryEvent) {
    sent.push(event)
    return Promise.resolve({ status: Status.Success })
  }

  close() {
    return Promise.resolve(true)
  }
}

async function validate() {
  const noMarker = knownEvent()
  assert.strictEqual(beforeSend(noMarker), noMarker)
  const badMarker = Object.defineProperty(
    new Error('int64'),
    '__closure__error__context__984382',
    {
      get() {
        throw new Error('getter')
      },
    },
  )
  assert.strictEqual(
    beforeSend(noMarker, { originalException: badMarker }),
    noMarker,
  )
  const known = knownEvent()
  const unchanged = JSON.stringify(known)
  assert.strictEqual(
    beforeSend(known, hint),
    null,
    'Known provider event is omitted',
  )
  assert.strictEqual(JSON.stringify(known), unchanged, 'Input is not mutated')

  const earlierVersion = knownEvent()
  earlierVersion.exception!.values![0].stacktrace!.frames!.forEach(frame => {
    frame.filename = frame.filename?.replace('r20261015', 'r20261001')
  })
  assert.strictEqual(beforeSend(earlierVersion, hint), earlierVersion)

  for (const [name, event] of retained) {
    assert.strictEqual(beforeSend(event, hint), event, name)
  }

  // Exercise the installed SDK normalization and transport boundary offline.
  // No default instrumentation or real network transport is installed.
  const client = new BrowserClient({
    dsn: 'https://test@example.invalid/1',
    defaultIntegrations: false,
    beforeSend,
    transport: RecordingTransport,
  })
  client.captureEvent(knownEvent(), hint)
  const nativeEvent = knownEvent()
  nativeEvent.extra = { arguments: [new Event('visibilitychange')] }
  client.captureEvent(nativeEvent, hint)
  for (const [, event] of retained) client.captureEvent(event, hint)
  assert.strictEqual(await client.flush(1000), true)
  assert.strictEqual(
    sent.length,
    retained.length,
    'SDK preserves near misses only',
  )
  assert.strictEqual(await client.close(1000), true)
  console.log(
    `Sentry validation passed: known signatures omitted; ${retained.length} near misses retained; installed SDK transport verified offline.`,
  )
}

validate().catch(error => {
  console.error(error)
  process.exitCode = 1
})
