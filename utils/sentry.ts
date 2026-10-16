import {
  Event,
  EventHint,
  StackFrame,
  eventFromException,
  wrap,
} from '@sentry/browser'

const rumScript =
  'https://pagead2.googlesyndication.com/pagead/js/r20261015/r20190131/rum_fy2021.js'
const providerFunctions = ['', 'ie', 'I', 'ag', 'N', 'wb', 'Ia']

const sameLocation = (left: StackFrame, right?: StackFrame) =>
  !!right &&
  !!left.filename &&
  !!left.lineno &&
  !!left.colno &&
  left.filename === right.filename &&
  left.lineno === right.lineno &&
  left.colno === right.colno

export const createBeforeSend = () => {
  let wrapper: StackFrame | undefined
  // The callback returns an Error without throwing or capturing it. The SDK's
  // shared callback invocation identifies its wrapper in this exact bundle;
  // source-mapped filenames are unavailable in beforeSend.
  try {
    const probe = wrap(() => new Error('Sentry wrapper location'))
    eventFromException({}, probe).then(event => {
      const frames = event.exception?.values?.[0].stacktrace?.frames
      if (frames && frames.length >= 3) wrapper = frames[frames.length - 2]
    })
  } catch {
    // A missing location retains the event, including on unsupported engines.
  }

  return (event: Event, hint?: EventHint): Event | null => {
    try {
      const exceptions = event.exception?.values
      if (event.type || exceptions?.length !== 1) return event
      const exception = exceptions[0]
      const mechanism = exception.mechanism
      const args: unknown = event.extra?.arguments
      const original = hint?.originalException as
        | {
            __closure__error__context__984382?: { severity?: unknown }
          }
        | undefined
      if (
        exception.type !== 'Error' ||
        exception.value !== 'int64' ||
        original?.__closure__error__context__984382?.severity !== 'warning' ||
        mechanism?.type !== 'instrument' ||
        mechanism.handled !== true ||
        mechanism.data?.function !== 'addEventListener' ||
        mechanism.data?.target !== 'EventTarget' ||
        !Array.isArray(args) ||
        args[0]?.type !== 'visibilitychange'
      )
        return event

      const frames = exception.stacktrace?.frames
      if (!frames) return event
      // An unminified SDK may strip its named oldest wrapper automatically.
      const provider =
        frames.length === 8 && sameLocation(frames[0], wrapper)
          ? frames.slice(1)
          : frames
      if (
        provider.length !== providerFunctions.length ||
        !provider.every(
          (frame, index) =>
            frame.filename === rumScript &&
            (index === 0
              ? !frame.function ||
                frame.function === '?' ||
                frame.function === '<anonymous>'
              : frame.function === providerFunctions[index]),
        )
      )
        return event

      // Only this verified Google visibility/serialization failure is omitted.
      // A provider revision or unknown application frame remains reportable.
      return null
    } catch {
      return event
    }
  }
}
