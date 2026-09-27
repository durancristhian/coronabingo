import { Room, RoomBase } from '~/interfaces/models/Room'
import { roomsRef, Timestamp } from '~/utils/firebase'

const defaultRoomData: RoomBase = {
  activateAdminCode: false,
  adminId: '',
  bingoSpinner: true,
  code: '',
  confettiType: '',
  date: Timestamp.now(),
  hideNumbersMeaning: false,
  locked: false,
  name: '',
  readyToPlay: false,
  selectedNumbers: [],
  soundToPlay: '',
  streamerView: false,
  timesPlayed: 1,
}

const createRoom = async (room: Partial<RoomBase>) => {
  const roomDoc = roomsRef.doc()
  const roomId = roomDoc.id
  const createdAt = new Date()

  await roomDoc.set(
    Object.assign({}, defaultRoomData, room, {
      date: Timestamp.fromDate(createdAt),
    }),
  )

  return { createdAt, roomId }
}

const excludeExtraFields = (room: Room): RoomBase => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ref, ...roomValues } = room

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
