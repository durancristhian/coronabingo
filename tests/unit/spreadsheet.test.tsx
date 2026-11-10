import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import DownloadSpreadsheet from '~/components/DownloadSpreadsheet'
import { Player } from '~/interfaces/models/Player'
import { roomFixture, Translation } from './fixtures'

const exporter = vi.hoisted(() => vi.fn())
vi.mock('zipcelx', () => ({ default: exporter }))

test('a missing host prevents export instead of assigning another player as host', async () => {
  const player = { id: 'player', name: 'Player', tickets: '1,2' } as Player
  const guest = { id: 'guest', name: 'Guest', tickets: '3,4' } as Player
  const room = roomFixture({ name: 'Export room', adminId: 'deleted' })
  const players = [guest, player]
  const view = render(
    <Translation>
      <DownloadSpreadsheet room={room} players={players} />
    </Translation>,
  )
  const download = await screen.findByRole('button', {
    name: 'Export room.xlsx',
  })
  expect(download).toBeDisabled()
  expect(exporter).not.toHaveBeenCalled()
  view.rerender(
    <Translation>
      <DownloadSpreadsheet
        room={{ ...room, adminId: 'player' }}
        players={players}
      />
    </Translation>,
  )
  expect(screen.getByRole('button', { name: 'Export room.xlsx' })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: 'Export room.xlsx' }))
  const base = `${window.location.origin}/en/room/room-a`
  await waitFor(() =>
    expect(exporter).toHaveBeenCalledWith({
      filename: 'Export room',
      sheet: {
        data: [
          [
            { value: 'Room', type: 'string' },
            { value: 'Export room', type: 'string' },
          ],
          [
            { value: 'Link', type: 'string' },
            { value: base, type: 'string' },
          ],
          [
            { value: 'Players', type: 'string' },
            { value: 2, type: 'number' },
          ],
          [
            { value: 'Host', type: 'string' },
            { value: 'Player', type: 'string' },
            { value: '1,2', type: 'string' },
            { value: `${base}/player`, type: 'string' },
          ],
          [{ value: '', type: 'string' }],
          [
            { value: 'Guest', type: 'string' },
            { value: '3,4', type: 'string' },
            { value: `${base}/guest`, type: 'string' },
          ],
        ],
      },
    }),
  )
  expect(exporter).toHaveBeenCalledTimes(1)
})
