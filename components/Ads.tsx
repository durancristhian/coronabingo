import React, { useEffect } from 'react'

interface Props {
  url: string
}

export default function Ads({ url }: Props) {
  useEffect(() => {
    console.log(url)

    // @ts-ignore
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <ins
      key={url}
      className="adsbygoogle"
      style={{
        display: 'block',
        width: '728px',
        height: '90px',
      }}
      data-ad-client="ca-pub-6231280485856921"
      data-ad-slot="1185318534"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
