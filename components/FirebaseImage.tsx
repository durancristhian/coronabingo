import React, { useEffect, useState } from 'react'
import { storage } from '~/utils'
import Loading from './Loading'

interface Props {
  children(url: string): JSX.Element
  path: string
}

export default function FirebaseImage({ children, path }: Props) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    const getUrl = async () => {
      const url = await storage.child(path).getDownloadURL()

      setUrl(url)
    }

    getUrl()
  }, [])

  if (url) {
    return children(url)
  }

  return <Loading />
}
