import { Room, RoomBase } from '~/interfaces'
import { createBatch, roomsRef, Timestamp } from '~/utils'
import { defaultPlayerData } from './player'

const defaultRoomData: RoomBase = {
  adminId: '',
  bingoSpinner: true,
  code: '',
  confettiType: '',
  date: null,
  hideNumbersMeaning: false,
  name: '',
  selectedNumbers: [],
  soundToPlay: '',
  status: 'initialized',
  timesPlayed: 1,
}

const createRoom = (room: Partial<RoomBase>): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const batch = createBatch()
      const roomDoc = roomsRef.doc()
      const adminPlayerDoc = roomDoc.collection('players').doc()

      batch.set(roomDoc, {
        ...defaultRoomData,
        ...room,
        date: Timestamp.fromDate(new Date()),
        adminId: adminPlayerDoc.id,
      })

      batch.set(roomDoc.collection('players').doc(), {
        ...defaultPlayerData,
        name: 'Admin',
        date: Timestamp.fromDate(new Date()),
      })

      await batch.commit()

      resolve(roomDoc.id)
    } catch (e) {
      reject(e)
    }
  })
}

const excludeExtraFields = (room: Room): RoomBase => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { exists, id, ref, ...roomValues } = room

  return roomValues
}

const updateRoom = (
  roomRef: firebase.firestore.DocumentReference,
  roomData: Partial<RoomBase>,
): Promise<void> => {
  return roomRef.update(roomData)
}

const roomApi = {
  createRoom,
  excludeExtraFields,
  updateRoom,
}

export default roomApi
export { defaultRoomData }
