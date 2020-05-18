/// <reference types="cypress" />

describe('Player with admin access', () => {
  beforeEach(() => {
    cy.prepareRoom(true)
  })

  it('Should display a new number from bingo spinner', () => {
    cy.get('#next-number')
      .should('exist')
      .click()

    cy.get('[data-test-class="ball"]').should('have.length', 1)
    cy.get('#ticket-numbers')
      .find('.bg-green-400')
      .should('have.length', 1)
  })

  it('Should have admin options visible', () => {
    cy.get('#celebrations').should('exist')
    cy.get('#sounds').should('exist')
    cy.get('#reboot-game').should('exist')
  })

  it('Should reboot game', () => {
    cy.get('#reboot-game').click()

    cy.get('#confirm').click()

    cy.url().should('contain', 'admin')

    cy.get('#configure-room').click()

    cy.url().should('not.contain', 'admin')
  })
})
