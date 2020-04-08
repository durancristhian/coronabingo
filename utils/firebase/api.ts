import { roomsRef } from '~/utils/firebase'

export default {
  room: {
    onChange: (roomId: string, callback: Function) =>
      roomsRef.doc(roomId).onSnapshot(snapshot =>
        callback({
          id: snapshot.id,
          exists: snapshot.exists,
          ref: snapshot.ref,
          ...snapshot.data(),
        }),
      ),
  },
  players: {
    onChange: (
      roomRef: firebase.firestore.DocumentReference,
      callback: Function,
    ) =>
      roomRef.collection('players').onSnapshot(snapshot =>
        callback(
          snapshot.docs.map(p => ({
            id: p.id,
            exists: p.exists,
            ref: p.ref,
            ...p.data(),
          })),
        ),
      ),
  },
}
