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
  const view = render(
    <Translation>
      <DownloadSpreadsheet
        room={roomFixture({ adminId: 'deleted' })}
        players={[player]}
      />
    </Translation>,
  )
  const download = await screen.findByRole('button', { name: '.xlsx' })
  expect(download).toBeDisabled()
  expect(exporter).not.toHaveBeenCalled()
  // Recover when the room has a valid host again.
  view.rerender(
    <Translation>
      <DownloadSpreadsheet
        room={roomFixture({ adminId: 'player' })}
        players={[player]}
      />
    </Translation>,
  )
  expect(screen.getByRole('button', { name: '.xlsx' })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: '.xlsx' }))
  await waitFor(() => expect(exporter).toHaveBeenCalled())
})
