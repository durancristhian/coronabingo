import React, { useContext } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { RoomContext, RoomContextProvider } from '~/contexts/Room'
import { PlayerContext, PlayerContextProvider } from '~/contexts/Player'
import { PlayersContext, PlayersContextProvider } from '~/contexts/Players'
import { database } from './database'
import { routerFixture, Translation } from './fixtures'

function State() {
  const room = useContext(RoomContext)
  const player = useContext(PlayerContext)
  const players = useContext(PlayersContext)
  return (
    <output data-testid="states">
      {JSON.stringify([room.state, player.state, players.state])}
    </output>
  )
}

function listeners() {
  const subscriptions: {
    target: string
    next: (value: unknown) => void
    fail: (error: Error) => void
    stop: ReturnType<typeof vi.fn>
  }[] = []
  const listen = (target: string) => (
    _options: unknown,
    next: (value: unknown) => void,
    fail: (error: Error) => void,
  ) => {
    const stop = vi.fn()
    subscriptions.push({ target, next, fail, stop })
    return stop
  }
  database.doc.mockImplementation(target => ({
    onSnapshot: listen(target),
    collection: (name: string) => ({ onSnapshot: listen(`${target}/${name}`) }),
  }))
  return subscriptions
}

function tree(pathname: string, roomId?: string, playerId?: string) {
  return (
    <Translation
      router={routerFixture({
        pathname,
        query: { ...(roomId && { roomId }), ...(playerId && { playerId }) },
      })}
    >
      <RoomContextProvider>
        <PlayerContextProvider>
          <PlayersContextProvider>
            <State />
          </PlayersContextProvider>
        </PlayerContextProvider>
      </RoomContextProvider>
    </Translation>
  )
}

test.each([
  ['/', undefined, undefined, []],
  ['/', 'a', 'p', []],
  ['/room/[roomId]', 'a', undefined, ['a', 'a/players']],
  ['/room/[roomId]/admin', 'a', undefined, ['a', 'a/players']],
  ['/room/[roomId]/[playerId]', 'a', 'p', ['a', 'a/players/p']],
] as const)(
  'route %s subscribes only to its needed records',
  async (path, room, player, expected) => {
    const subscriptions = listeners()
    const view = render(tree(path, room, player))
    await act(async () => {
      await Promise.resolve()
    })
    expect(subscriptions.map(item => item.target).sort()).toEqual(
      [...expected].sort(),
    )
    view.unmount()
    subscriptions.forEach(item => expect(item.stop).toHaveBeenCalledTimes(1))
  },
)

test.each(['/room/[roomId]', '/room/[roomId]/[playerId]'])(
  'leaving %s during lazy loading never installs listeners',
  async path => {
    const subscriptions = listeners()
    const view = render(
      tree(path, 'a', path.endsWith('[playerId]') ? 'p' : undefined),
    )
    view.rerender(tree('/'))
    await act(async () => {
      await Promise.resolve()
    })
    expect(subscriptions).toEqual([])
  },
)

test.each(['/room/[roomId]', '/room/[roomId]/[playerId]'])(
  'navigation on %s ignores old-room callbacks, including a return to that room',
  async path => {
    const subscriptions = listeners()
    const view = render(
      tree(path, 'a', path.endsWith('[playerId]') ? 'p' : undefined),
    )
    await waitFor(() => expect(subscriptions).toHaveLength(2))
    view.rerender(
      tree(path, 'b', path.endsWith('[playerId]') ? 'p' : undefined),
    )
    await waitFor(() => expect(subscriptions).toHaveLength(4))
    view.rerender(
      tree(path, 'a', path.endsWith('[playerId]') ? 'p' : undefined),
    )
    await waitFor(() => expect(subscriptions).toHaveLength(6))
    const before = screen.getByTestId('states').textContent
    act(() =>
      subscriptions.slice(0, 4).forEach(item => {
        item.next({
          exists: false,
          docs: [],
          metadata: { hasPendingWrites: false },
        })
        item.fail(new Error('Late error'))
      }),
    )
    expect(screen.getByTestId('states').textContent).toBe(before)
    subscriptions
      .slice(0, 4)
      .forEach(item => expect(item.stop).toHaveBeenCalledTimes(1))
    view.unmount()
    subscriptions.forEach(item => expect(item.stop).toHaveBeenCalledTimes(1))
  },
)

test('switching rooms before imports settle subscribes only to the latest room', async () => {
  const subscriptions = listeners()
  const view = render(tree('/room/[roomId]', 'a'))
  view.rerender(tree('/room/[roomId]', 'b'))
  await act(async () => {
    await Promise.resolve()
  })
  expect(subscriptions.map(item => item.target).sort()).toEqual([
    'b',
    'b/players',
  ])
})

test('a listener setup failure is exposed to subscribers instead of hanging in loading', async () => {
  database.doc.mockImplementation(() => {
    throw new Error('Cannot subscribe')
  })
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
  render(tree('/room/[roomId]', 'a'))
  await waitFor(() => {
    const states = JSON.parse(screen.getByTestId('states').textContent || '[]')
    expect(states.map((state: { type: string }) => state.type)).toEqual([
      'FAILURE',
      'NOT_ASKED',
      'FAILURE',
    ])
  })
})

test('lobby and setup share their roster subscription until leaving the roster scope', async () => {
  const subscriptions = listeners()
  const view = render(tree('/room/[roomId]/admin', 'a'))
  await waitFor(() => expect(subscriptions).toHaveLength(2))
  view.rerender(tree('/room/[roomId]', 'a'))
  await act(async () => {
    await Promise.resolve()
  })
  expect(subscriptions).toHaveLength(2)
  subscriptions.forEach(item => expect(item.stop).not.toHaveBeenCalled())
  view.rerender(tree('/room/[roomId]/[playerId]', 'a', 'p'))
  await waitFor(() => expect(subscriptions).toHaveLength(3))
  expect(
    subscriptions.find(item => item.target === 'a/players')?.stop,
  ).toHaveBeenCalledTimes(1)
  expect(
    subscriptions.find(item => item.target === 'a')?.stop,
  ).not.toHaveBeenCalled()
})
