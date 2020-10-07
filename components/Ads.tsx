import React from 'react'
import AdSense from 'react-adsense'

export default function Ads() {
  return (
    <AdSense.Google
      client="ca-pub-6231280485856921"
      slot="1185318534"
      style={{ display: 'block', width: 768, height: 90 }}
      format="auto"
      responsive="true"
    />
  )
}
