import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Celebrations from '~/components/Celebrations'
import { roomFixture, Translation } from './fixtures'

for (const language of ['en', 'es'] as const) {
  test(`${language}: inactive celebrations announce the action they perform`, () => {
    render(
      <Translation language={language}>
        <Celebrations room={roomFixture({ confettiType: 'confetti' })} />
      </Translation>,
    )
    expect(
      screen.getByRole('button', {
        name: language === 'en' ? 'Show balloons' : 'Mostrar globos',
      }),
    ).toHaveTextContent(language === 'en' ? 'Show balloons' : 'Mostrar globos')
    expect(
      screen.getByRole('button', {
        name: language === 'en' ? 'Hide confetti' : 'Ocultar confeti',
      }),
    ).toBeEnabled()
  })
}
