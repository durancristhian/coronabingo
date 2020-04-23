import { Player, PlayerBase, Room } from '~/interfaces'
import { Timestamp } from '~/utils/firebase'

const defaultPlayerData: PlayerBase = {
  boards: '',
  date: null,
  name: '',
  selectedNumbers: [],
}

const createPlayer = (
  room: Room,
  player: Partial<PlayerBase>,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const playerDoc = room.ref.collection('players').doc()
      const playerId = playerDoc.id

      await playerDoc.set(
        Object.assign({}, defaultPlayerData, player, {
          date: Timestamp.fromDate(new Date()),
        }),
      )

      resolve(playerId)
    } catch (error) {
      reject(error)
    }
  })
}

const excludeExtraFields = (player: Player): PlayerBase => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { exists, id, ref, ...playerValues } = player

  return playerValues
}

const updatePlayer = (
  playerRef: firebase.firestore.DocumentReference,
  playerData: Partial<PlayerBase>,
): Promise<void> => {
  return playerRef.update(playerData)
}

const playerApi = {
  createPlayer,
  excludeExtraFields,
  updatePlayer,
}

export default playerApi
export { defaultPlayerData }
