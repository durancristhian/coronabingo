import { Player, PlayerBase, Room } from '~/interfaces'
import { Timestamp } from '~/utils'

const defaultPlayerData: PlayerBase = {
  tickets: '',
  date: Timestamp.now(),
  name: '',
  selectedNumbers: [],
}

const createPlayer = (
  room: Room,
  player: Partial<PlayerBase>,
): {
  playerId: string
  playerRef: firebase.firestore.DocumentReference<
    firebase.firestore.DocumentData
  >
  playerData: PlayerBase
} => {
  const playerRef = room.ref.collection('players').doc()
  const playerId = playerRef.id
  const playerData = Object.assign({}, defaultPlayerData, player, {
    date: Timestamp.fromDate(new Date()),
  })

  return { playerId, playerRef, playerData }
}

const excludeExtraFields = (player: Player): PlayerBase => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ref, ...playerValues } = player

  return playerValues
}

const removePlayer = async (player: Player) => {
  return await player.ref.delete()
}

const playerApi = {
  createPlayer,
  excludeExtraFields,
  removePlayer,
}

export default playerApi
export { defaultPlayerData }
