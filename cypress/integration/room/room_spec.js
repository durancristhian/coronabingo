/// <reference types="cypress" />

describe('Room', () => {
  beforeEach(() => {
    cy.configureRoom()
  })

  it('Should allow to download the spreadsheet with room information', () => {
    for (let index = 0; index < 7; index++) {
      cy.get('#room-title').click()
    }

    cy.get('#download-spreadsheet').should('exist')
  })
})
