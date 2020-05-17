/// <reference types="cypress" />

describe('Room', () => {
  beforeEach(() => {
    cy.server()

    const configuredRoom = Cypress.env('configuredRoom')
    const roomId = configuredRoom.id

    cy.visit(`http://localhost:3000/es/room/${roomId}`)
  })

  it('Should allow to download the spreadsheet with room information', () => {
    for (let index = 0; index < 7; index++) {
      cy.get('#room-title').click()
    }

    cy.get('#download-spreadsheet').should('exist')
  })
})
