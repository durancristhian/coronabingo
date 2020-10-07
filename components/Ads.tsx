import React, { useEffect } from 'react'

interface Props {
  url: string
}

export default function Ads({ url }: Props) {
  useEffect(() => {
    // @ts-ignore
    window.adsbygoogle = window.adsbygoogle || []

    // @ts-ignore
    window.adsbygoogle.push({})
  }, [url])

  return (
    <ins
      key={url}
      className="adsbygoogle"
      style={{
        display: 'block',
      }}
      data-ad-client="ca-pub-6231280485856921"
      data-ad-slot="1185318534"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
