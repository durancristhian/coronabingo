import Script from 'next/script'
import React, { createContext, ReactNode, useContext, useState } from 'react'

const AdScriptReady = createContext(false)

export const useAdScriptReady = () => useContext(AdScriptReady)

export function AdScriptProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  // The isolated UI runner intercepts this script and blocks external traffic.
  const enabled =
    process.env.NODE_ENV === 'production' || process.env.UI_TESTS === '1'

  return (
    <AdScriptReady.Provider value={ready}>
      {children}
      {enabled && (
        <Script
          id="adsense-script"
          data-ad-client="ca-pub-6231280485856921"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
          onReady={() => setReady(true)}
          onError={() => setReady(false)}
        />
      )}
    </AdScriptReady.Provider>
  )
}
