import { useEffect, useState } from 'react'
import { FirebaseData } from '~/interfaces'
import { db } from '~/utils'

export default function useDocument(
  collection: string,
  documentId: string | undefined,
) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FirebaseData>()

  useEffect(() => {
    if (!collection || !documentId) return

    setLoading(true)

    const unsubscribe = db
      .collection(collection)
      .doc(documentId)
      .onSnapshot(
        snapshot => {
          const docData = snapshot.data()

          setData({
            id: snapshot.id,
            ref: snapshot.ref,
            ...docData,
          })

          setLoading(false)
        },
        error => {
          console.error(error)

          setError(`Error getting document (${documentId}) in ${collection}`)

          setLoading(false)
        },
      )

    return () => {
      unsubscribe()
    }
  }, [collection, documentId])

  return {
    data,
    error,
    loading,
  }
}
