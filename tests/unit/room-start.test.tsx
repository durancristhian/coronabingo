import React from 'react'
import Router from 'next/router'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import RoomAdmin from '~/pages/room/[roomId]/admin'
import { RoomContextProvider } from '~/contexts/Room'
import { PlayersContextProvider } from '~/contexts/Players'
import { database } from './database'
import { roomFixture, routerFixture, Translation } from './fixtures'

const boundary = vi.hoisted(() => ({
  batch: vi.fn(),
  createToast: vi.fn(),
  updateToast: vi.fn(),
  dismissToast: vi.fn(),
}))
vi.mock('~/hooks/useToast', () => ({ default: () => boundary }))
vi.mock('~/utils/firebase', async () => {
  const { database } = await import('./database')
  return {
    roomsRef: { doc: database.doc },
    createBatch: boundary.batch,
    Timestamp: { now: () => ({ toDate: () => new Date() }) },
  }
})

function deferred() {
  let resolve!: () => void
  let reject!: (error: Error) => void
  const promise = new Promise<void>((yes, no) => {
    resolve = yes
    reject = no
  })
  return { promise, resolve, reject }
}

beforeEach(() => {
  vi.clearAllMocks()
  boundary.batch.mockReset()
  vi.stubGlobal('scroll', vi.fn())
  boundary.createToast.mockImplementation(
    () => boundary.createToast.mock.calls.length,
  )
})

async function setup(language: 'en' | 'es' = 'en') {
  const listeners = new Map<string, (value: unknown) => void>()
  const rosters = new Map<string, (value: unknown) => void>()
  database.doc.mockImplementation((id: string) => ({
    onSnapshot: (_options: unknown, next: (value: unknown) => void) => {
      listeners.set(id, next)
      return vi.fn()
    },
    collection: () => ({
      onSnapshot: (_options: unknown, next: (value: unknown) => void) => {
        rosters.set(id, next)
        return vi.fn()
      },
    }),
  }))
  let router = routerFixture()
  const tree = () => (
    <Translation language={language} router={router}>
      <RoomContextProvider>
        <PlayersContextProvider>
          <RoomAdmin />
        </PlayersContextProvider>
      </RoomContextProvider>
    </Translation>
  )
  const view = render(tree())
  const navigate = async (id: string) => {
    router = routerFixture({
      pathname: '/room/[roomId]/admin',
      query: { roomId: id },
    })
    view.rerender(tree())
    await waitFor(() => {
      expect(listeners.has(id)).toBe(true)
      expect(rosters.has(id)).toBe(true)
    })
    act(() => {
      listeners.get(id)?.({
        exists: true,
        id,
        ref: { id },
        metadata: { hasPendingWrites: false },
        data: () => roomFixture({ id, adminId: `host-${id}`, code: 'code' }),
      })
      rosters.get(id)?.({
        metadata: { hasPendingWrites: false },
        docs: ['host', 'player'].map(role => ({
          exists: true,
          id: `${role}-${id}`,
          ref: { id: `${role}-${id}` },
          data: () => ({ name: `${role} ${id}`, tickets: '1,2' }),
        })),
      })
    })
    await screen.findByText(`host ${id}`, { selector: 'p' })
  }
  await navigate('a')
  const start = () =>
    screen.getByRole('button', {
      name: language === 'en' ? 'Start game' : 'Empezar partida',
    })
  return { navigate, start, unmount: view.unmount }
}

function queueCommit() {
  const pending = deferred()
  const batch = {
    update: vi.fn(),
    set: vi.fn(),
    commit: vi.fn(() => pending.promise),
  }
  boundary.batch.mockReturnValueOnce(batch)
  return { ...pending, batch }
}

for (const outcome of ['resolve', 'reject'] as const) {
  test(`A ${outcome} in idle B has no stale feedback or navigation`, async () => {
    const a = queueCommit()
    const view = await setup()
    fireEvent.click(view.start())
    expect(a.batch.commit).toHaveBeenCalledTimes(1)
    await view.navigate('b')
    await act(async () => {
      if (outcome === 'resolve') a.resolve()
      else a.reject(new Error('A failed'))
    })
    expect(Router.push).not.toHaveBeenCalled()
    expect(boundary.updateToast).not.toHaveBeenCalled()
    expect(view.start()).toBeEnabled()
  })

  test(`A ${outcome} after navigation cannot redirect or unlock pending B`, async () => {
    const a = queueCommit()
    const b = queueCommit()
    const view = await setup()
    act(() => {
      fireEvent.click(view.start())
      fireEvent.click(view.start())
    })
    expect(a.batch.commit).toHaveBeenCalledTimes(1)
    await view.navigate('b')
    expect(view.start()).toBeEnabled()
    fireEvent.click(view.start())
    expect(b.batch.commit).toHaveBeenCalledTimes(1)
    await act(async () => {
      if (outcome === 'resolve') a.resolve()
      else a.reject(new Error('A failed'))
    })
    expect(Router.push).not.toHaveBeenCalled()
    expect(boundary.updateToast).not.toHaveBeenCalled()
    expect(view.start()).toBeDisabled()
    await act(async () => b.resolve())
    expect(Router.push).toHaveBeenCalledExactlyOnceWith(
      '/room/[roomId]',
      '/room/b',
    )
    expect(boundary.updateToast).toHaveBeenCalledWith(
      'admin:success',
      'success',
      2,
    )
    await view.navigate('a')
    expect(view.start()).toBeEnabled()
  })

  test(`A ${outcome} after unmount cannot navigate or update feedback`, async () => {
    const a = queueCommit()
    const view = await setup()
    fireEvent.click(view.start())
    view.unmount()
    await act(async () => {
      if (outcome === 'resolve') a.resolve()
      else a.reject(new Error('A failed'))
    })
    expect(Router.push).not.toHaveBeenCalled()
    expect(boundary.updateToast).not.toHaveBeenCalled()
    expect(boundary.dismissToast).toHaveBeenCalledWith(1)
  })
}

for (const language of ['en', 'es'] as const) {
  test(`A-B-A keeps A locked until rejection, then permits retry in ${language}`, async () => {
    const a = queueCommit()
    const retry = queueCommit()
    const view = await setup(language)
    fireEvent.click(view.start())
    await view.navigate('b')
    expect(view.start()).toBeEnabled()
    await view.navigate('a')
    expect(view.start()).toBeDisabled()
    fireEvent.click(view.start())
    expect(a.batch.commit).toHaveBeenCalledTimes(1)
    await act(async () => a.reject(new Error('Try again')))
    expect(view.start()).toBeEnabled()
    expect(boundary.updateToast).toHaveBeenCalledWith('admin:error', 'error', 1)
    fireEvent.click(view.start())
    await act(async () => retry.resolve())
    expect(Router.push).toHaveBeenCalledExactlyOnceWith(
      '/room/[roomId]',
      '/room/a',
    )
    expect(retry.batch.update.mock.calls[0][0]).toEqual({ id: 'a' })
    expect(retry.batch.set).toHaveBeenCalledTimes(2)
    expect(view.start()).toBeEnabled()
  })
}
