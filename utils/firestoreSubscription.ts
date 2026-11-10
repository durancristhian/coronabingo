type Database = typeof import('./firebase')

export function subscribeToFirestore<Snapshot>(
  subscribe: (
    database: Database,
    next: (snapshot: Snapshot) => void,
    fail: (error: Error) => void,
  ) => () => void,
  next: (snapshot: Snapshot) => void,
  fail: (error: Error) => void,
) {
  let active = true
  let unsubscribe: (() => void) | undefined
  const onError = (error: Error) => {
    if (active) fail(error)
  }

  void import('./firebase')
    .then(database => {
      if (!active) return
      unsubscribe = subscribe(
        database,
        snapshot => {
          if (active) next(snapshot)
        },
        onError,
      )
    })
    .catch(onError)

  return () => {
    active = false
    unsubscribe?.()
  }
}
