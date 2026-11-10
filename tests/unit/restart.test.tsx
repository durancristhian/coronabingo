import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import Router from 'next/router'
import { expect, test, vi } from 'vitest'
import Restart from '~/components/Restart'
import roomApi from '~/models/room'
import { logEvent } from '~/utils/gtag'
import { roomFixture, Translation } from './fixtures'

const { logout } = vi.hoisted(() => ({ logout: vi.fn() }))
vi.mock('~/hooks/useRoomCode', () => ({ default: () => ({ logout }) }))
vi.mock('~/utils/gtag', () => ({ logEvent: vi.fn() }))

for (const language of ['es', 'en'] as const) {
  test(`${language}: rejected restart stays retryable without success effects`, async () => {
    let reject!: (error: Error) => void
    let resolve!: () => void
    const update = vi
      .spyOn(roomApi, 'updateRoom')
      .mockImplementationOnce(
        () =>
          new Promise<void>((_, fail) => {
            reject = fail
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<void>(done => {
            resolve = done
          }),
      )
    const room = roomFixture({ activateAdminCode: true, timesPlayed: 2 })
    render(
      <Translation language={language}>
        <Restart room={room} />
      </Translation>,
    )
    const button = screen.getByRole('button', {
      name: language === 'es' ? 'Reiniciar partida' : 'Restart game',
    })
    act(() => {
      button.click()
      button.click()
    })
    expect(update).toHaveBeenCalledTimes(1)
    expect(button).toBeDisabled()
    await act(async () => reject(new Error('Permission denied')))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      language === 'es'
        ? 'No pudimos reiniciar la partida. Inténtalo de nuevo.'
        : "We couldn't restart the game. Try again.",
    )
    expect(button).toBeEnabled()
    expect(Router.push).not.toHaveBeenCalled()
    expect(logout).not.toHaveBeenCalled()
    expect(logEvent).not.toHaveBeenCalled()
    fireEvent.click(button)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(button).toBeDisabled()
    expect(update).toHaveBeenCalledTimes(2)
    expect(update).toHaveBeenLastCalledWith(room.ref, {
      readyToPlay: false,
      selectedNumbers: [],
      soundToPlay: '',
      soundCommandId: '',
      confettiType: '',
      timesPlayed: 3,
    })
    await act(async () => resolve())
    await waitFor(() =>
      expect(Router.push).toHaveBeenCalledWith(
        '/room/[roomId]/admin',
        `/room/${room.id}/admin`,
      ),
    )
    expect(logout).toHaveBeenCalledTimes(1)
    expect(logEvent).toHaveBeenCalledTimes(1)
    expect(logEvent).toHaveBeenCalledWith('room_restarted', expect.any(Object))
  })
}
