interface TwitterWidgets {
  createTweet(
    id: string,
    target: HTMLElement,
    options: { align: 'center'; width: number },
  ): Promise<HTMLElement | undefined>
}

interface TwitterAPI {
  ready(callback: (api: TwitterAPI) => void): void
  widgets: TwitterWidgets
}

declare global {
  interface Window {
    twttr?: TwitterAPI
  }
}

let widgetsPromise: Promise<TwitterWidgets> | undefined

export function loadTwitterWidgets(): Promise<TwitterWidgets> {
  if (window.twttr?.widgets?.createTweet) {
    return Promise.resolve(window.twttr.widgets)
  }
  if (widgetsPromise) return widgetsPromise

  widgetsPromise = new Promise<TwitterWidgets>((resolve, reject) => {
    const script = document.createElement('script')
    let timeout = 0
    const cleanup = () => {
      window.clearTimeout(timeout)
      script.onload = null
      script.onerror = null
    }
    const fail = () => {
      cleanup()
      script.remove()
      reject(new Error('Twitter widgets could not be loaded'))
    }
    timeout = window.setTimeout(fail, 20000)
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.onerror = fail
    script.onload = () => {
      try {
        if (!window.twttr) return fail()
        window.twttr.ready(api => {
          if (!api.widgets?.createTweet) return fail()
          cleanup()
          resolve(api.widgets)
        })
      } catch {
        fail()
      }
    }
    document.body.appendChild(script)
  }).catch(error => {
    // A later mount can retry after a network failure.
    widgetsPromise = undefined
    throw error
  })

  return widgetsPromise
}
