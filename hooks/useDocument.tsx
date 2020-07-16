import { useEffect, useState } from 'react'
import { RemoteData, REMOTE_DATA } from '~/interfaces'
import { db } from '~/utils'

export default function useDocument<T>(
  collection: string,
  documentId: string | undefined,
) {
  const [state, setState] = useState<RemoteData<Error, T>>({
    type: REMOTE_DATA.NOT_ASKED,
  })

  useEffect(() => {
    if (!collection || !documentId) return

    setState({
      type: REMOTE_DATA.LOADING,
    })

    const unsubscribe = db
      .collection(collection)
      .doc(documentId)
      .onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            setState({
              type: REMOTE_DATA.FAILURE,
              error: new Error(
                `Deleted document ${documentId} in ${collection}`,
              ),
            })

            return
          }

          /* TODO: review this `as T` */
          const docData = snapshot.data() as T
          const doc = {
            ...docData,
            id: snapshot.id,
            ref: snapshot.ref,
          }

          setState({ type: REMOTE_DATA.SUCCESS, data: doc })
        },
        error => {
          setState({ type: REMOTE_DATA.FAILURE, error })

          console.error(error)
        },
      )

    return () => {
      unsubscribe()
    }
  }, [collection, documentId])

  return {
    error: state.type === REMOTE_DATA.FAILURE,
    loading:
      state.type === REMOTE_DATA.NOT_ASKED ||
      state.type === REMOTE_DATA.LOADING,
    data: state.type === REMOTE_DATA.SUCCESS ? state.data : null,
  }
}
