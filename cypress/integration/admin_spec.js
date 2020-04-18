/// <reference types="cypress" />

describe('Admin', () => {
  beforeEach(() => {
    cy.server()

    cy.visit('http://localhost:3000/es/room/7JRgOvrnskGEcaAsUDJd/admin')
  })

  it('Should have a #configure-room disabled by default', () => {
    cy.get('#configure-room').should('be.disabled')
  })

  it('Should have a #add-player disabled by default', () => {
    cy.get('#add-player').should('be.disabled')
  })

  it('Should add players to the room', () => {
    /* Keyboard */
    cy.get('#name').type('Player 1{enter}')
    cy.get('#name').type('Player 2{enter}')

    /* Click */
    cy.get('#name').type('Player 3')
    cy.get('#add-player').click()

    cy.get('#players-list')
      .children()
      .should('have.length', 3)
  })
})
