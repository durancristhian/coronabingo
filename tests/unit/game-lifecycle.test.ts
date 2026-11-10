import { expect, test, vi } from 'vitest'
import roomApi from '~/models/room'
import { Player } from '~/interfaces/models/Player'
import { Room } from '~/interfaces/models/Room'
import { database } from './database'
import { roomFixture } from './fixtures'

test('starting a game atomically keeps setup and assigns clean cards to every player', async () => {
  const updates: { ref: unknown; data: Record<string, unknown> }[] = []
  const replacements: { ref: unknown; data: Record<string, unknown> }[] = []
  const commit = vi.fn().mockResolvedValue(undefined)
  database.createBatch.mockReturnValue({
    update: (ref: unknown, data: Record<string, unknown>) =>
      updates.push({ ref, data }),
    set: (ref: unknown, data: Record<string, unknown>) =>
      replacements.push({ ref, data }),
    commit,
  })
  const room = roomFixture({
    readyToPlay: false,
    adminId: 'host',
    code: 'protected-code',
    timesPlayed: 3,
    bingoSpinner: false,
    selectedNumbers: [5],
    soundToPlay: 'old.mp3',
    soundCommandId: 'old-command',
    confettiType: 'confetti',
  })
  const players = (['Host', 'Guest'].map((name, index) => ({
    id: `player-${index}`,
    ref: { id: `player-ref-${index}` },
    name,
    tickets: '5,6',
    date: room.date,
    selectedNumbers: [9],
    5: [9, 10],
    6: [20],
  })) as unknown) as Player[]

  await roomApi.startGame(room, players, ['1,2', '3,4'])

  expect(commit).toHaveBeenCalledTimes(1)
  expect(updates).toHaveLength(1)
  expect(updates[0].ref).toBe(room.ref)
  expect(updates[0].data).toMatchObject({
    adminId: 'host',
    code: 'protected-code',
    timesPlayed: 3,
    bingoSpinner: false,
    date: room.date,
    readyToPlay: true,
    selectedNumbers: [],
    soundToPlay: '',
    soundCommandId: '',
    confettiType: '',
  })
  expect(updates[0].data).not.toHaveProperty('id')
  expect(updates[0].data).not.toHaveProperty('ref')
  expect(replacements).toEqual(
    players.map((player, index) => ({
      ref: player.ref,
      data: {
        name: player.name,
        date: player.date,
        tickets: index === 0 ? '1,2' : '3,4',
        selectedNumbers: [],
      },
    })),
  )
})

test('restarting preserves room setup and advances only the game state', async () => {
  const update = vi.fn().mockResolvedValue(undefined)
  const room = roomFixture({
    ref: ({ update } as unknown) as Room['ref'],
    timesPlayed: 4,
    selectedNumbers: [3],
    soundToPlay: 'playing.mp3',
    soundCommandId: 'command',
    confettiType: 'confetti',
  })
  await roomApi.restartGame(room)
  expect(update).toHaveBeenCalledWith({
    readyToPlay: false,
    selectedNumbers: [],
    soundToPlay: '',
    soundCommandId: '',
    confettiType: '',
    timesPlayed: 5,
  })
})

test('a failed game-start batch remains a rejected operation for the caller', async () => {
  const error = new Error('Cannot commit')
  database.createBatch.mockReturnValue({
    update: vi.fn(),
    commit: vi.fn().mockRejectedValue(error),
  })
  await expect(roomApi.startGame(roomFixture(), [], [])).rejects.toBe(error)
})
