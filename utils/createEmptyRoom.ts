import { defaultRoomData } from '~/models/room'
import { createBatch, generateRoomCode, roomsRef, Timestamp } from '~/utils'

export async function createEmptyRoom(
  roomName: string,
  adminName: string,
  playerNameTemplate: (index: number) => string,
  playersAmount: number,
  randomTickets: string[],
) {
  try {
    if (playersAmount > 500) {
      throw new Error(`You can't create a room with more than 500 players`)
    }

    const code = generateRoomCode()
    const batch = createBatch()
    const roomRef = roomsRef.doc()

    batch.set(roomRef, {
      ...defaultRoomData,
      activateAdminCode: true,
      bingoSpinner: false,
      code,
      date: Timestamp.fromDate(new Date()),
      name: roomName,
      hideNumbersMeaning: true,
      locked: true,
      readyToPlay: true,
    })

    const adminRef = roomRef.collection('players').doc()

    batch.set(adminRef, {
      date: Timestamp.fromDate(new Date()),
      name: adminName,
      selectedNumbers: [],
      tickets: randomTickets[0],
    })

    batch.update(roomRef, {
      adminId: adminRef.id,
    })

    for (let index = 1; index < playersAmount; index++) {
      const playerRef = roomRef.collection('players').doc()

      batch.set(playerRef, {
        date: Timestamp.fromDate(new Date()),
        name: playerNameTemplate(index + 1),
        selectedNumbers: [],
        tickets: randomTickets[index],
      })
    }

    await batch.commit()

    return {
      roomId: roomRef.id,
      code,
    }

    /* TODO: download the spreadsheet */
  } catch (error) {
    console.error(error)
  }
}
