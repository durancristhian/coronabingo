import { useEffect, useState } from 'react'
import { FirebaseData } from '~/interfaces'
import { db } from '~/utils'

export default function useSubCollection(
  collection: string,
  documentId: string | undefined,
  subCollection: string,
) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<FirebaseData[]>()

  useEffect(() => {
    if (!collection || !documentId || !subCollection) return

    setLoading(true)

    const unsubscribe = db
      .collection(collection)
      .doc(documentId)
      .collection(subCollection)
      .onSnapshot(
        snapshot => {
          setData(
            snapshot.docs.map(doc => {
              const docData = doc.data()

              return {
                id: doc.id,
                ref: doc.ref,
                ...docData,
              }
            }),
          )

          setLoading(false)
        },
        error => {
          console.error(error)

          setError(
            `Error getting ${subCollection} in document ${documentId} from ${collection}`,
          )

          setLoading(false)
        },
      )

    return () => {
      unsubscribe()
    }
  }, [collection, documentId, subCollection])

  return {
    data,
    error,
    loading,
  }
}
