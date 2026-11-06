import firebase from 'firebase/compat/app'
import { Room, RoomBase } from '~/interfaces/models/Room'
import { TICKET_NUMBERS } from '~/utils/constants'
import { roomsRef, runTransaction, Timestamp } from '~/utils/firebase'

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
  soundCommandId: '',
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

const changeCalledNumber = (room: Room, number?: number) =>
  runTransaction(async transaction => {
    const snapshot = await transaction.get(room.ref)
    const current = snapshot.data() as RoomBase | undefined
    // A delayed click from a previous game must never alter the next one.
    if (
      !current?.readyToPlay ||
      current.timesPlayed !== room.timesPlayed ||
      current.bingoSpinner !== room.bingoSpinner
    )
      return
    const selected = current.selectedNumbers || []
    let numbers: number[]
    if (current.bingoSpinner) {
      const missing = TICKET_NUMBERS.filter(value => !selected.includes(value))
      if (!missing.length) return
      const next = missing[Math.floor(Math.random() * missing.length)]
      numbers = [next, ...selected]
    } else {
      if (number === undefined || !TICKET_NUMBERS.includes(number)) return
      numbers = selected.includes(number)
        ? selected.filter(value => value !== number)
        : [number, ...selected]
    }
    transaction.update(room.ref, { selectedNumbers: numbers })
  })

const clearSound = (room: Room) =>
  runTransaction(async transaction => {
    const snapshot = await transaction.get(room.ref)
    const current = snapshot.data() as RoomBase | undefined
    if (
      current?.timesPlayed === room.timesPlayed &&
      current.soundToPlay === room.soundToPlay &&
      current.soundCommandId === room.soundCommandId
    ) {
      transaction.update(room.ref, { soundToPlay: '', soundCommandId: '' })
    }
  })

const roomApi = {
  changeCalledNumber,
  clearSound,
  createRoom,
  excludeExtraFields,
  updateRoom,
}

export default roomApi
export { defaultRoomData }
