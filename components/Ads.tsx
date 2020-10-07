import React, { useEffect } from 'react'

export default function Ads() {
  useEffect(() => {
    // @ts-ignore
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'block',
        height: '90px',
        width: '728px',
      }}
      data-ad-client="ca-pub-6231280485856921"
      data-ad-slot="1185318534"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
