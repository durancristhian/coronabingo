/// <reference types="cypress" />

describe('Bingo Spinner', () => {
  beforeEach(() => {
    cy.server()

    cy.visit('http://localhost:3000')

    cy.get('#name').type('Hello world')

    cy.get('#create-room').click()

    cy.get('#name').type('Player 1{enter}')
    cy.get('#name').type('Player 2{enter}')

    cy.get('#adminId').select('Player 1')
  })

  it('Should use bingo spinner', () => {
    cy.get('#configure-room').click()

    cy.wait(1000)

    cy.get('#play1').click()

    cy.wait(1000)

    cy.get('#next-number').should('be.enabled')
  })

  it('Should not use bingo spinner', () => {
    cy.get('#bingo-spinner').click()

    cy.get('#configure-room').click()

    cy.wait(1000)

    cy.get('#play1').click()

    cy.wait(1000)

    cy.get('#next-number').should('not.be.visible')
  })
})
