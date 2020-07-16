import { useEffect, useState } from 'react'
import { RemoteData, REMOTE_DATA } from '~/interfaces'
import { db } from '~/utils'

export default function useSubCollection<T>(
  collection: string,
  documentId: string | undefined,
  subCollection: string,
) {
  const [state, setState] = useState<RemoteData<Error, T[]>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  useEffect(() => {
    if (!collection || !documentId || !subCollection) return

    setState({
      type: REMOTE_DATA.LOADING,
    })

    const unsubscribe = db
      .collection(collection)
      .doc(documentId)
      .collection(subCollection)
      .onSnapshot(
        snapshot => {
          const docs = snapshot.docs
            .filter(doc => doc.exists)
            .map(doc => {
              /* TODO: review this `as T` */
              const docData = doc.data() as T

              return {
                ...docData,
                id: doc.id,
                ref: doc.ref,
              }
            })

          setState({ type: REMOTE_DATA.SUCCESS, data: docs })
        },
        error => {
          setState({ type: REMOTE_DATA.FAILURE, error })

          console.error(error)
        },
      )

    return () => {
      unsubscribe()
    }
  }, [collection, documentId, subCollection])

  return {
    error: state.type === REMOTE_DATA.FAILURE,
    loading:
      state.type === REMOTE_DATA.NOT_ASKED ||
      state.type === REMOTE_DATA.LOADING,
    data: state.type === REMOTE_DATA.SUCCESS ? state.data : null,
  }
}
