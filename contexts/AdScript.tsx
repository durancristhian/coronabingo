import Script from 'next/script'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type ScriptStatus = 'loading' | 'ready' | 'unavailable'
const AdScriptStatus = createContext<ScriptStatus>('loading')

export const useAdScriptStatus = () => useContext(AdScriptStatus)

export function AdScriptProvider({ children }: { children: ReactNode }) {
  // The isolated UI runner intercepts this script and blocks external traffic.
  const enabled =
    process.env.NODE_ENV === 'production' || process.env.UI_TESTS === '1'
  const [status, setStatus] = useState<ScriptStatus>(
    enabled ? 'loading' : 'unavailable',
  )

  useEffect(() => {
    if (status !== 'loading') return
    const timeout = window.setTimeout(() => setStatus('unavailable'), 15_000)
    return () => window.clearTimeout(timeout)
  }, [status])

  return (
    <AdScriptStatus.Provider value={status}>
      {children}
      {enabled && (
        <Script
          id="adsense-script"
          data-ad-client="ca-pub-6231280485856921"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
          // A late SDK must not reopen manual slots after the loading deadline.
          onReady={() =>
            setStatus(current => (current === 'loading' ? 'ready' : current))
          }
          onError={() => setStatus('unavailable')}
        />
      )}
    </AdScriptStatus.Provider>
  )
}
