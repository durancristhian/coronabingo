import React, { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { expect, test } from 'vitest'
import { FlagsContextProvider } from '~/contexts/Flags'
import useEasterEgg from '~/hooks/useEasterEgg'
import useTickets from '~/hooks/useTickets'

test('assigned cards are replaced and cleared with their assignment', () => {
  const { result, rerender } = renderHook(
    ({ assignments }) => useTickets(assignments),
    { initialProps: { assignments: '1,2' } },
  )
  expect(result.current.map(ticket => ticket.id)).toEqual([1, 2])
  expect(result.current.every(ticket => ticket.numbers.length === 27)).toBe(
    true,
  )
  rerender({ assignments: '3,4' })
  expect(result.current.map(ticket => ticket.id)).toEqual([3, 4])
  rerender({ assignments: '' })
  expect(result.current).toEqual([])
})

test('seven interactions enable only the targeted feature', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <FlagsContextProvider>{children}</FlagsContextProvider>
  )
  const { result } = renderHook(
    () => ({
      spreadsheet: useEasterEgg('downloadSpreadsheet'),
      sounds: useEasterEgg('extraSounds'),
    }),
    { wrapper },
  )
  for (let index = 0; index < 6; index++) {
    act(() => result.current.spreadsheet.incrementInteractions())
    expect(result.current.spreadsheet.isActive).toBe(false)
  }
  act(() => result.current.spreadsheet.incrementInteractions())
  expect(result.current.spreadsheet.isActive).toBe(true)
  expect(result.current.sounds.isActive).toBe(false)
  act(() => result.current.spreadsheet.incrementInteractions())
  expect(result.current.spreadsheet.isActive).toBe(true)
})
